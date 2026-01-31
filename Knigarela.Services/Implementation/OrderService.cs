using AutoMapper;
using Knigarela.Core.Entities;
using Knigarela.Core.Enums;
using Knigarela.Core.Pagination;
using Knigarela.Infrastructure.Data;
using Knigarela.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Speedy.Models;
using System.Data;

namespace Knigarela.Services;

public class OrderService : IOrderService
{
    private readonly KnigarelaDbContext _db;
    private readonly IClientService _clientService;
    private readonly IMapper _mapper;
    private readonly ISpeedyService speedyService;

    private readonly Dictionary<string, Func<IQueryable<Order>, string, IQueryable<Order>>> _filterMap =
        new()
        {
            ["number"] = (q, v) =>
                string.IsNullOrWhiteSpace(v)
                    ? q
                    : q.Where(o => o.OrderNumber.ToString().ToLower().Contains(v.ToLower())),
            ["clientName"] = (q, v) =>
                string.IsNullOrWhiteSpace(v)
                    ? q
                    : q.Where(o => o.Client!.FullName!.ToLower().Contains(v.ToLower())),
            ["status"] = (q, v) =>
            {
                Enum.TryParse<OrderStatus>(v, ignoreCase: true, out var orderStatus);
                return v == "all"
                     ? q
                     : q.Where(o => o.Status == orderStatus);
            },
            ["date"] = (q, v) =>
                DateOnly.TryParse(v, out var d)
                    ? q.Where(o => DateOnly.FromDateTime(o.CreatedAt) == d)
                    : q,
            ["dateFrom"] = (q, v) =>
                DateOnly.TryParse(v, out var d)
                    ? q.Where(o => DateOnly.FromDateTime(o.CreatedAt) >= d)
                    : q,
            ["dateTo"] = (q, v) =>
                DateOnly.TryParse(v, out var d)
                    ? q.Where(o => DateOnly.FromDateTime(o.CreatedAt) <= d)
                    : q,
        };

    private sealed record BoxSnapshot(Guid Id, int Count, decimal SinglePrice, decimal SubscriptionPrice, bool IsActive);

    public OrderService(
        KnigarelaDbContext db,
        IClientService clientService,
        IConfiguration configuration, // kept for DI compatibility
        IMapper mapper,
        ISpeedyService speedyService)
    {
        _db = db;
        _clientService = clientService;
        _mapper = mapper;
        this.speedyService = speedyService;
    }

    public async Task<CreateOrderResult> CreateOrderWithStockCheckAsync(
        string fullName,
        string email,
        string phone,
        OrderAddress address,
        List<(Guid BoxId, int Quantity, PurchaseType type)> items,
        string? notes = null,
        bool useLock = false)
    {
        // useLock kept only for signature compatibility; stock is safe with atomic updates
        if (items == null || items.Count == 0)
            throw new ArgumentException("Cannot create order without items.");

        return await CreateOrderAtomicAsync(fullName, email, phone, address, items, notes);
    }

    public async Task<Order?> GetByIdAsync(Guid id)
    {
        return await _db.Orders
            .Include(o => o.Client)
            .Include(o => o.Items).ThenInclude(i => i.Box).ThenInclude(b => b.Images)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<PagedResult<Order>> GetAllAsync(DataQuery<string> query)
    {
        return await DynamicQuery.ApplyAsync(
            _db.Orders
                .Include(x => x.Client!)
                .Include(o => o.Items!).ThenInclude(i => i.Box)
                .AsQueryable(),
            query,
            o => o,
            _filterMap);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var order = await _db.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null) return false;

        if (order.Status != OrderStatus.New)
            throw new InvalidOperationException("Only orders with 'New' status can be deleted.");

        await using var tx = await _db.Database.BeginTransactionAsync(IsolationLevel.ReadCommitted);

        // Return stock (atomic increment) for each box (aggregated)
        if (order.Items is { Count: > 0 })
        {
            var increments = order.Items
                .GroupBy(i => i.BoxId)
                .Select(g => new { BoxId = g.Key, Quantity = g.Sum(x => x.Quantity) })
                .ToList();

            foreach (var inc in increments)
            {
                await _db.Boxes
                    .Where(b => b.Id == inc.BoxId)
                    .ExecuteUpdateAsync(s => s
                        .SetProperty(b => b.Count, b => b.Count + inc.Quantity)
                        .SetProperty(b => b.UpdatedAt, _ => DateTime.Now));
            }
        }

        _db.Orders.Remove(order);
        await _db.SaveChangesAsync();
        await tx.CommitAsync();

        return true;
    }

    private async Task<CreateOrderResult> CreateOrderAtomicAsync(
        string fullName,
        string email,
        string phone,
        OrderAddress address,
        List<(Guid BoxId, int Quantity, PurchaseType type)> items,
        string? notes)
    {
        // Aggregate quantities per box (if the UI sends duplicates)
        var aggregated = items
            .GroupBy(i => i.BoxId)
            .Select(g => new { BoxId = g.Key, Quantity = g.Sum(x => x.Quantity) })
            .OrderBy(x => x.BoxId) // deterministic order to reduce deadlocks
            .ToList();

        var issues = new List<StockIssue>();

        foreach (var x in aggregated)
        {
            if (x.Quantity <= 0)
                issues.Add(new StockIssue(x.BoxId, 0, x.Quantity, "InvalidQuantity"));
        }

        if (issues.Count > 0)
            return new CreateOrderResult(null, issues);

        var boxIds = aggregated.Select(x => x.BoxId).ToList();

        var strategy = _db.Database.CreateExecutionStrategy();

        return await strategy.ExecuteAsync(async () =>
        {
            await using var tx = await _db.Database.BeginTransactionAsync(IsolationLevel.ReadCommitted);

            // Snapshot data for pricing + existence checks (no tracking; stock is handled via UPDATE)
            var snapshots = await _db.Boxes
                .AsNoTracking()
                .Where(b => boxIds.Contains(b.Id))
                .Select(b => new BoxSnapshot(b.Id, b.Count, b.SinglePrice, b.SubscriptionPrice, b.IsActive))
                .ToDictionaryAsync(b => b.Id);

            foreach (var x in aggregated)
            {
                if (!snapshots.TryGetValue(x.BoxId, out var snap))
                {
                    issues.Add(new StockIssue(x.BoxId, 0, x.Quantity, "NotFound"));
                    continue;
                }

                // Optional: if only active boxes are orderable, enforce it here
                // if (!snap.IsActive) issues.Add(new StockIssue(x.BoxId, snap.Count, x.Quantity, "NotActive"));
            }

            if (issues.Count > 0)
            {
                await tx.RollbackAsync();
                return new CreateOrderResult(null, issues);
            }

            // Reserve stock for each box atomically. If anything fails -> rollback.
            foreach (var x in aggregated)
            {
                var affected = await _db.Boxes
                    .Where(b => b.Id == x.BoxId && b.Count >= x.Quantity)
                    .ExecuteUpdateAsync(s => s
                        .SetProperty(b => b.Count, b => b.Count - x.Quantity)
                        .SetProperty(b => b.UpdatedAt, _ => DateTime.Now));

                if (affected != 1)
                {
                    // read current count for a meaningful error (best effort)
                    var available = await _db.Boxes.AsNoTracking()
                        .Where(b => b.Id == x.BoxId)
                        .Select(b => b.Count)
                        .SingleOrDefaultAsync();

                    issues.Add(new StockIssue(x.BoxId, available, x.Quantity, "NotEnoughStock"));
                }
            }

            if (issues.Count > 0)
            {
                await tx.RollbackAsync();
                return new CreateOrderResult(null, issues);
            }

            // Create or get client (kept as-is)
            DateOnly? subDate = items.Any(x => x.type == PurchaseType.Subscription)
                ? DateOnly.FromDateTime(DateTime.Now)
                : null;

            var client = await _clientService.FindOrCreateClientAsync(
                new Client
                {
                    FullName = fullName,
                    Email = email,
                    Phone = phone,
                    Addresses = new List<ClientAddress>
                    {
                        _mapper.Map<ClientAddress>(address)
                    },
                    IsNewSubscriber = subDate.HasValue,
                    IsSubscribed = subDate.HasValue,
                    SubscriptionDate = subDate
                });

            var order = new Order
            {
                ClientId = client.Id,
                Client = client,
                Address = address,
                CreatedAt = DateTime.Now,
                Note = notes,
                Items = new List<OrderItem>(),
                Status = OrderStatus.New,
            };

            // Build order items + prices from snapshot (price at time of order)
            foreach (var (boxId, quantity, type) in items)
            {
                var snap = snapshots[boxId];

                order.Items!.Add(new OrderItem
                {
                    BoxId = boxId,
                    Quantity = quantity,
                    PurchaseType = type,
                    UnitPrice = type == PurchaseType.Single ? snap.SinglePrice : snap.SubscriptionPrice
                });
            }

            await CalculateOrderDeliveryAmount(order);

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            await tx.CommitAsync();
            return new CreateOrderResult(order, issues);
        });
    }

    // Create subscription orders for all subscribed clients using the currently active box.
    // Refactor: reserve stock once (atomic) for the number of subscribers we can actually serve.
    public async Task<List<CreateOrderResult>> CreateOrdersForSubscribersAsync(int quantityPerSubscriber = 1)
    {
        if (quantityPerSubscriber <= 0)
            throw new ArgumentException("quantityPerSubscriber must be > 0", nameof(quantityPerSubscriber));

        var strategy = _db.Database.CreateExecutionStrategy();

        return await strategy.ExecuteAsync(async () =>
        {
            await using var tx = await _db.Database.BeginTransactionAsync(IsolationLevel.ReadCommitted);

            var activeBox = await _db.Boxes
                .AsNoTracking()
                .Where(b => b.IsActive)
                .Select(b => new BoxSnapshot(b.Id, b.Count, b.SinglePrice, b.SubscriptionPrice, b.IsActive))
                .FirstOrDefaultAsync();

            if (activeBox == null)
            {
                await tx.RollbackAsync();
                throw new InvalidOperationException("No active box found to create subscription orders.");
            }

            var subscribers = await _db.Clients
                .Include(c => c.Addresses)
                .Where(c => c.IsSubscribed)
                .OrderBy(c => c.Id)
                .ToListAsync();

            if (subscribers.Count == 0)
            {
                await tx.CommitAsync();
                return new List<CreateOrderResult>();
            }

            // Keep the return list aligned 1:1 with the subscribers list
            var results = new CreateOrderResult[subscribers.Count];

            // Split subscribers into eligible (has default address) and ineligible (no default address)
            var eligible = new List<(int Index, Client Client, ClientAddress DefaultAddress)>(subscribers.Count);
            for (int i = 0; i < subscribers.Count; i++)
            {
                var client = subscribers[i];
                var defaultAddress = client.Addresses?.FirstOrDefault(x => x.IsDefault);
                if (defaultAddress == null)
                {
                    results[i] = new CreateOrderResult(null, new List<StockIssue>
                    {
                        new(activeBox.Id, 0, quantityPerSubscriber, $"NoDefaultAddress for client:{client.FullName}")
                    });
                    continue;
                }

                eligible.Add((i, client, defaultAddress));
            }

            if (eligible.Count == 0)
            {
                await tx.CommitAsync();
                return results.ToList();
            }

            var maxOrders = activeBox.Count / quantityPerSubscriber;
            var toCreate = Math.Min(maxOrders, eligible.Count);

            if (toCreate <= 0)
            {
                // No stock for any eligible subscriber
                foreach (var (index, _, _) in eligible)
                {
                    results[index] = new CreateOrderResult(null, new List<StockIssue>
                    {
                        new(activeBox.Id, activeBox.Count, quantityPerSubscriber, "NotEnoughStock")
                    });
                }

                await tx.CommitAsync();
                return results.ToList();
            }

            // Reserve total stock once for eligible subscribers we can serve
            var totalQty = toCreate * quantityPerSubscriber;

            var affected = await _db.Boxes
                .Where(b => b.Id == activeBox.Id && b.Count >= totalQty)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(b => b.Count, b => b.Count - totalQty)
                    .SetProperty(b => b.UpdatedAt, _ => DateTime.Now));

            if (affected != 1)
            {
                var availableNow = await _db.Boxes.AsNoTracking()
                    .Where(b => b.Id == activeBox.Id)
                    .Select(b => b.Count)
                    .SingleAsync();

                foreach (var (index, _, _) in eligible)
                {
                    results[index] = new CreateOrderResult(null, new List<StockIssue>
                    {
                        new(activeBox.Id, availableNow, quantityPerSubscriber, "NotEnoughStock")
                    });
                }

                await tx.RollbackAsync();
                return results.ToList();
            }

            // Create orders for first 'toCreate' eligible subscribers
            for (int idx = 0; idx < eligible.Count; idx++)
            {
                var (index, client, defaultAddress) = eligible[idx];
                var issues = new List<StockIssue>();

                if (idx >= toCreate)
                {
                    issues.Add(new StockIssue(activeBox.Id, 0, quantityPerSubscriber, "NotEnoughStock"));
                    results[index] = new CreateOrderResult(null, issues);
                    continue;
                }

                var order = new Order
                {
                    ClientId = client.Id,
                    Client = client,
                    Address = _mapper.Map<OrderAddress>(defaultAddress),
                    CreatedAt = DateTime.Now,
                    Note = null,
                    Items = new List<OrderItem>
                    {
                        new OrderItem
                        {
                            BoxId = activeBox.Id,
                            Quantity = quantityPerSubscriber,
                            PurchaseType = PurchaseType.Subscription,
                            UnitPrice = activeBox.SubscriptionPrice
                        }
                    },
                    Status = OrderStatus.New
                };

                await CalculateOrderDeliveryAmount(order);

                _db.Orders.Add(order);
                results[index] = new CreateOrderResult(order, issues);
            }

            await _db.SaveChangesAsync();
            await tx.CommitAsync();

            // results[] is fully filled now
            return results.ToList();
        });
    }

    private async Task CalculateOrderDeliveryAmount(Order order)
    {
        if (order?.Items == null || order.Items.Count < 1)
            return;

        var parcels = order.Items.Sum(x => x.Quantity);
        var deliveryFee = await speedyService.CalculateAsync(
            parcels,
            parcels * 1,
            order.Items.Sum(x => x.Quantity * x.UnitPrice),
            order.Address);

        order.DeliveryAmount = deliveryFee?.Calculations?.FirstOrDefault()?.Price?.Total;
    }

    public async Task<string> PrintLabelsAsync(Guid id, PaperSize size)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order == null)
            throw new Exception($"Order with id {id} not found!");

        return await this.speedyService.PrintLabelsAsync(size, order.ParcelIds);
    }

    public async Task<string> PrintAllLabelsAsync(PaperSize size)
    {
        var orders = _db.Orders.Where(x => x.Status == OrderStatus.Processing);
        if (!orders.Any())
            throw new Exception("There are no Orders for proccessing");

        return await this.speedyService.PrintLabelsAsync(size, orders.SelectMany(x => x.ParcelIds).ToArray());
    }
}

public record StockIssue(Guid BoxId, int Available, int Requested, string Reason);

public record CreateOrderResult(Order? Order, List<StockIssue> Issues)
{
    public bool Success => Order != null && Issues.Count == 0;
}

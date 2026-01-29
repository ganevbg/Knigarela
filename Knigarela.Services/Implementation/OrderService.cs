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
    private readonly int MaxConcurrencyRetries;
    private readonly int RetryDelayMs;
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


    public OrderService(KnigarelaDbContext db, IClientService clientService, IConfiguration configuration, IMapper mapper, ISpeedyService speedyService)
    {
        _db = db;
        _clientService = clientService;
        MaxConcurrencyRetries = int.TryParse(configuration["Concurrency:MaxRetries"], out int mr) ? mr : 5;
        RetryDelayMs = int.TryParse(configuration["Concurrency:RetryDelayMs"], out int rd) ? rd : 250;
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
        if (items == null || items.Count == 0)
            throw new ArgumentException("Cannot create order without items.");

        return useLock ? await CreateOrderPessimisticAsync(fullName, email, phone, address, items, notes) : await CreateOrderOptimisticAsync(fullName, email, phone, address, items, notes);
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
        return await DynamicQuery.ApplyAsync(_db.Orders.Include(x => x.Client!).Include(o => o.Items!).ThenInclude(i => i.Box).AsQueryable(), query, o => o, _filterMap);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order == null) return false;

        if (order.Status != OrderStatus.New)
            throw new InvalidOperationException("Only orders with 'New' status can be deleted.");

        _db.Orders.Remove(order);

        if (order.Items != null && order.Items.Count > 0)
        {
            foreach (var item in order.Items)
            {
                var box = _db.Boxes.Single(x => x.Id == item.BoxId);
                box.Count += item.Quantity;
            }
        }

        await _db.SaveChangesAsync();
        return true;
    }

    // Shared preparation logic: validate, decrement counts, create client and build order (does not save).
    private async Task<(Order? Order, List<StockIssue> Issues)> PrepareOrderAsync(
        Dictionary<Guid, Box> boxes,
        string fullName,
        string email,
        string phone,
        OrderAddress address,
        List<(Guid BoxId, int Quantity, PurchaseType type)> items,
        string? notes)
    {
        var issues = new List<StockIssue>();

        // Validate stock and quantities
        foreach (var (boxId, quantity, _) in items)
        {
            if (!boxes.TryGetValue(boxId, out var box))
            {
                issues.Add(new StockIssue(boxId, 0, quantity, "NotFound"));
                continue;
            }

            if (quantity <= 0)
            {
                issues.Add(new StockIssue(boxId, box.Count, quantity, "InvalidQuantity"));
                continue;
            }

            if (box.Count < quantity)
            {
                issues.Add(new StockIssue(boxId, box.Count, quantity, "NotEnoughStock"));
            }
        }

        if (issues.Count > 0)
            return (null, issues);

        DateOnly? subDate = items.Any(x => x.type == PurchaseType.Subscription) ? DateOnly.FromDateTime(DateTime.Now) : null;

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

        // Reserve stock (modify tracked entities)
        foreach (var (boxId, quantity, type) in items)
        {
            var box = boxes[boxId];
            box.Count -= quantity;

            order.Items.Add(new OrderItem
            {
                BoxId = box.Id,
                Quantity = quantity,
                PurchaseType = type,
                UnitPrice = type == PurchaseType.Single ? box.SinglePrice : box.SubscriptionPrice
            });
        }

        await CalculateOrderDeliveryAmount(order);

        return (order, issues);
    }

    private async Task<CreateOrderResult> CreateOrderOptimisticAsync(
        string fullName,
        string email,
        string phone,
        OrderAddress address,
        List<(Guid BoxId, int Quantity, PurchaseType type)> items,
        string? notes)
    {
        var boxIds = items.Select(i => i.BoxId).Distinct().ToList();

        for (int attempt = 1; attempt <= MaxConcurrencyRetries; attempt++)
        {
            var boxes = await _db.Boxes
                .Where(b => boxIds.Contains(b.Id))
                .ToDictionaryAsync(b => b.Id, b => b);

            var (order, issues) = await PrepareOrderAsync(boxes, fullName, email, phone, address, items, notes);

            if (issues.Count > 0)
                return new CreateOrderResult(null, issues);

            _db.Orders.Add(order!);

            try
            {
                await _db.SaveChangesAsync();
                return new CreateOrderResult(order, issues);
            }
            catch (DbUpdateConcurrencyException)
            {
                // clear tracked state so next attempt reads fresh data
                _db.ChangeTracker.Clear();
                if (attempt < MaxConcurrencyRetries)
                {
                    await Task.Delay(RetryDelayMs + Random.Shared.Next(0, 100));
                    continue;
                }

                var concurrentIssues = items.Select(i =>
                    new StockIssue(i.BoxId, 0, i.Quantity, "ConcurrentUpdate")).ToList();

                return new CreateOrderResult(null, concurrentIssues);
            }
        }

        return new CreateOrderResult(null, new List<StockIssue> {
            new(Guid.Empty, 0, 0, "UnknownError")
        });
    }

    private async Task<CreateOrderResult> CreateOrderPessimisticAsync(
        string fullName,
        string email,
        string phone,
        OrderAddress address,
        List<(Guid BoxId, int Quantity, PurchaseType type)> items,
        string? notes)
    {
        var boxIds = items.Select(i => i.BoxId).Distinct().ToArray();
        var strategy = _db.Database.CreateExecutionStrategy();

        return await strategy.ExecuteAsync(async () =>
        {
            await using var tx = await _db.Database.BeginTransactionAsync(IsolationLevel.Serializable);

            var boxes = await _db.Boxes
                .FromSqlRaw(@"SELECT *, xmin FROM ""Boxes"" WHERE ""Id"" = ANY ({0}) FOR UPDATE", boxIds)
                .ToDictionaryAsync(b => b.Id);

            var (order, issues) = await PrepareOrderAsync(boxes, fullName, email, phone, address, items, notes);

            if (issues.Count > 0)
            {
                await tx.RollbackAsync();
                return new CreateOrderResult(null, issues);
            }

            _db.Orders.Add(order!);
            await _db.SaveChangesAsync();
            await tx.CommitAsync();

            return new CreateOrderResult(order, issues);
        });
    }

    // Create subscription orders for all subscribed clients using the currently active box.
    // Returns a list of results, one per subscriber. If an order couldn't be created for a
    // subscriber a CreateOrderResult with Issues will be returned for that client.
    public async Task<List<CreateOrderResult>> CreateOrdersForSubscribersAsync(int quantityPerSubscriber = 1)
    {
        if (quantityPerSubscriber <= 0) throw new ArgumentException("quantityPerSubscriber must be > 0", nameof(quantityPerSubscriber));

        var strategy = _db.Database.CreateExecutionStrategy();

        return await strategy.ExecuteAsync(async () =>
        {
            await using var tx = await _db.Database.BeginTransactionAsync(IsolationLevel.Serializable);

            // Lock the active box row to prevent concurrent modifications
            var activeBox = await _db.Boxes
                .FromSqlRaw(@"SELECT *, xmin FROM ""Boxes"" WHERE ""IsActive"" = TRUE FOR UPDATE")
                .FirstOrDefaultAsync();

            if (activeBox == null)
            {
                await tx.RollbackAsync();
                throw new InvalidOperationException("No active box found to create subscription orders.");
            }

            var subscribers = await _db.Clients
                .Include(c => c.Addresses)
                .Where(c => c.IsSubscribed)
                .ToListAsync();

            var results = new List<CreateOrderResult>();

            foreach (var client in subscribers)
            {
                var issues = new List<StockIssue>();

                var addressEntity = client.Addresses?.FirstOrDefault(x => x.IsDefault);
                if (addressEntity == null)
                {
                    issues.Add(new StockIssue(activeBox.Id, activeBox.Count, quantityPerSubscriber, $"NoDefaultAddress for client:{client.FullName}"));
                    results.Add(new CreateOrderResult(null, issues));
                    continue;
                }

                if (activeBox.Count < quantityPerSubscriber)
                {
                    issues.Add(new StockIssue(activeBox.Id, activeBox.Count, quantityPerSubscriber, "NotEnoughStock"));
                    results.Add(new CreateOrderResult(null, issues));
                    continue;
                }

                // Reserve
                activeBox.Count -= quantityPerSubscriber;

                var order = new Order
                {
                    ClientId = client.Id,
                    Client = client,
                    Address = _mapper.Map<OrderAddress>(addressEntity),
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
                results.Add(new CreateOrderResult(order, issues));
            }

            await _db.SaveChangesAsync();
            await tx.CommitAsync();

            return results;
        });
    }

    private async Task CalculateOrderDeliveryAmount(Order order)
    {
        if (order == null || order.Items == null || order.Items.Count < 1)
        {
            return;
        }

        var parcels = order.Items.Sum(x => x.Quantity);
        var deliveryFee = await speedyService.CalculateAsync(parcels, parcels * 1, order.Items.Sum(x => x.Quantity * x.UnitPrice), order.Address);
        order.DeliveryAmount = deliveryFee?.Calculations?.FirstOrDefault()?.Price?.Total;
    }

    public async Task<string> PrintLabelsAsync(Guid id, PaperSize size)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order == null)
        {
            throw new Exception($"Order with id {id} not found!");
        }

        return await this.speedyService.PrintLabelsAsync(size, order.ParcelIds);
    }

    public async Task<string> PrintAllLabelsAsync(PaperSize size)
    {
        var orders = _db.Orders.Where(x => x.Status == OrderStatus.Processing);
        if (orders == null || orders.Count() < 1)
        {
            throw new Exception("There are no Orders for proccessing");
        }

        return await this.speedyService.PrintLabelsAsync(size, orders.SelectMany(x => x.ParcelIds).ToArray());
    }
}

public record StockIssue(Guid BoxId, int Available, int Requested, string Reason);

public record CreateOrderResult(Order? Order, List<StockIssue> Issues)
{
    public bool Success => Order != null && Issues.Count == 0;
}
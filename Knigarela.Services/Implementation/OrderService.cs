using System.Data;
using AutoMapper;
using Knigarela.Core.Entities;
using Knigarela.Core.Enums;
using Knigarela.Infrastructure.Data;
using Knigarela.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Knigarela.Services;

public class OrderService : IOrderService
{
    private readonly KnigarelaDbContext _db;
    private readonly IClientService _clientService;
    private readonly IMapper _mapper;

    private readonly int MaxConcurrencyRetries;
    private readonly int RetryDelayMs;

    public OrderService(KnigarelaDbContext db, IClientService clientService, IConfiguration configuration, IMapper mapper)
    {
        _db = db;
        _clientService = clientService;
        MaxConcurrencyRetries = int.TryParse(configuration["Concurrency:MaxRetries"], out int mr) ? mr : 5;
        RetryDelayMs = int.TryParse(configuration["Concurrency:RetryDelayMs"], out int rd) ? rd : 250;
        _mapper = mapper;
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

        if (useLock)
            return await CreateOrderPessimisticAsync(fullName, email, phone, address, items, notes);
        else
            return await CreateOrderOptimisticAsync(fullName, email, phone, address, items, notes);
    }


    public async Task<Order?> GetByIdAsync(Guid id)
    {
        return await _db.Orders
            .Include(o => o.Client)
            .Include(o => o.Items).ThenInclude(i => i.Box).ThenInclude(b => b.Images)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<List<Order>> GetAllAsync()
    {
        return await _db.Orders
            .Include(o => o.Client)
            .Include(o => o.Items).ThenInclude(i => i.Box)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order == null) return false;

        _db.Orders.Remove(order);
        await _db.SaveChangesAsync();
        return true;
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

            var issues = new List<StockIssue>();

            // Validate stock
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
                return new CreateOrderResult(null, issues);

            // Build client + order
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
                    SubscriptionDate = items.Any(x => x.type == PurchaseType.Subscription) ? DateOnly.FromDateTime(DateTime.UtcNow) : null
                });
            var order = new Order
            {
                ClientId = client.Id,
                Client = client,
                Address = address,
                CreatedAt = DateTime.UtcNow,
                Note = notes,
                Items = new List<OrderItem>()
            };

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

            _db.Orders.Add(order);

            try
            {
                await _db.SaveChangesAsync();
                return new CreateOrderResult(order, issues);
            }
            catch (DbUpdateConcurrencyException)
            {
                _db.ChangeTracker.Clear();
                if (attempt < MaxConcurrencyRetries)
                {
                    await Task.Delay(RetryDelayMs + Random.Shared.Next(0, 100));
                    continue;
                }

                issues.AddRange(items.Select(i =>
                    new StockIssue(i.BoxId, 0, i.Quantity, "ConcurrentUpdate")));

                return new CreateOrderResult(null, issues);
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
                .FromSqlRaw(@"SELECT * FROM ""Boxes"" WHERE ""Id"" = ANY ({0}) FOR UPDATE", boxIds)
                .ToDictionaryAsync(b => b.Id);

            var issues = new List<StockIssue>();

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
            {
                await tx.RollbackAsync();
                return new CreateOrderResult(null, issues);
            }

            foreach (var (boxId, quantity, _) in items)
                boxes[boxId].Count -= quantity;

            var client = await _clientService.FindOrCreateClientAsync(new Client { FullName = fullName, Email = email, Phone = phone, Addresses = new List<ClientAddress> { _mapper.Map<ClientAddress>(address) } });

            var order = new Order
            {
                ClientId = client.Id,
                Client = client,
                Address = address,
                CreatedAt = DateTime.UtcNow,
                Note = notes,
                Items = new List<OrderItem>()
            };

            foreach (var (boxId, quantity, type) in items)
            {
                var box = boxes[boxId];
                order.Items.Add(new OrderItem
                {
                    BoxId = box.Id,
                    Quantity = quantity,
                    PurchaseType = type,
                    UnitPrice = type == PurchaseType.Single ? box.SinglePrice : box.SubscriptionPrice
                });
            }

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();
            await tx.CommitAsync();

            return new CreateOrderResult(order, issues);
        });
    }
}

public record StockIssue(Guid BoxId, int Available, int Requested, string Reason);

public record CreateOrderResult(Order? Order, List<StockIssue> Issues)
{
    public bool Success => Order != null && Issues.Count == 0;
}
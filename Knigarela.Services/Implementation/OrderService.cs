using Knigarela.Core.Entities;
using Knigarela.Core.Enums;
using Knigarela.Infrastructure.Data;
using Knigarela.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Knigarela.Services;

public class OrderService : IOrderService
{
    private readonly KnigarelaDbContext _db;
    private readonly IClientService _clientService;

    public OrderService(KnigarelaDbContext db, IClientService clientService)
    {
        _db = db;
        _clientService = clientService;
    }

    public async Task<Order> CreateOrderAsync(
        string fullName,
        string email,
        string phone,
        OrderAddress address,
        List<(Guid BoxId, int Quantity, PurchaseType type)> items,
        string? notes = null)
    {
        if (items == null || items.Count == 0)
            throw new ArgumentException("Cannot create order without items.");

        var client = await _clientService.FindOrCreateClientAsync(fullName, email, phone);

        var boxIds = items.Select(i => i.BoxId).ToList();
        var boxes = await _db.Boxes
            .Where(b => boxIds.Contains(b.Id))
            .ToDictionaryAsync(b => b.Id, b => b);

        var order = new Order
        {
            Id = Guid.NewGuid(),
            ClientId = client.Id,
            Client = client,
            Address = address,
            CreatedAt = DateTime.UtcNow,
            Items = new List<OrderItem>()
        };

        foreach (var (boxId, quantity, type) in items)
        {
            if (!boxes.TryGetValue(boxId, out var box))
                throw new InvalidOperationException($"Box with ID {boxId} not found.");

            order.Items.Add(new OrderItem
            {
                Id = Guid.NewGuid(),
                BoxId = box.Id,
                Quantity = quantity,
                PurchaseType = type,
                UnitPrice = type == PurchaseType.Single ? box.SinglePrice : box.SubscriptionPrice
            });
        }

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        return order;
    }

    public async Task<Order?> GetByIdAsync(Guid id)
    {
        return await _db.Orders
            .Include(o => o.Client)
            .Include(o => o.Items)
            .ThenInclude(i => i.Box)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<List<Order>> GetAllAsync()
    {
        return await _db.Orders
            .Include(o => o.Client)
            .Include(o => o.Items)
            .ThenInclude(i => i.Box)
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
}

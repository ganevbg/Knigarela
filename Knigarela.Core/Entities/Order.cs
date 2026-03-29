using Knigarela.Core.Enums;
using Speedy.Models;

namespace Knigarela.Core.Entities;

public class Order : BaseEntity
{
    public Guid ClientId { get; set; }

    public Client? Client { get; set; }

    // Delivery snapshot
    public OrderAddress? Address { get; set; }

    // Total order price (calculated)
    public decimal TotalAmount => Items?.Sum(i => i.TotalPrice) ?? 0m;

    public decimal? DeliveryAmount { get; set; }

    public string? SpeedyId { get; set; }

    public string? Note { get; set; }

    public ICollection<OrderItem>? Items { get; set; }

    public OrderStatus Status { get; set; }

    public long OrderNumber { get; set; }

    public string[]? ParcelIds { get; set; }
}

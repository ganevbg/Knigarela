namespace Knigarela.Core.Entities;

public class Order : BaseEntity
{
    public Guid ClientId { get; set; }

    public Client Client { get; set; }

    // Delivery snapshot
    public OrderAddress Address { get; set; }

    // Total order price (calculated)
    public decimal TotalAmount => Items?.Sum(i => i.TotalPrice) ?? 0m;

    public string? Note { get; set; }

    public ICollection<OrderItem> Items { get; set; }
}

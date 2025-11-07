namespace Knigarela.Core.Entities;

public class Order
{
    public Guid Id { get; set; }

    public Guid ClientId { get; set; }
    public Client Client { get; set; }

    // Delivery snapshot
    public OrderAddress Address { get; set; }

    public DateTime CreatedAt { get; set; }

    // Total order price (calculated)
    public decimal TotalAmount => Items?.Sum(i => i.TotalPrice) ?? 0m;

    public ICollection<OrderItem> Items { get; set; }
}

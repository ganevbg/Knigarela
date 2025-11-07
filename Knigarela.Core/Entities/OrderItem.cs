namespace Knigarela.Core.Entities;

public class OrderItem
{
    public Guid Id { get; set; }

    public Guid OrderId { get; set; }
    public Order Order { get; set; }

    public Guid BoxId { get; set; }
    public Box Box { get; set; }

    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }  // price at order time
    public decimal TotalPrice => Quantity * UnitPrice;
}

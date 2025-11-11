using Knigarela.Core.Enums;

namespace Knigarela.Core.Entities;

public class OrderItem : BaseEntity
{
    public Guid OrderId { get; set; }

    public Order Order { get; set; }

    public Guid BoxId { get; set; }

    public Box Box { get; set; }

    public int Quantity { get; set; }

    public PurchaseType PurchaseType { get; set; }

    public decimal UnitPrice { get; set; }  // price at order time
    
    public decimal TotalPrice => Quantity * UnitPrice;
}

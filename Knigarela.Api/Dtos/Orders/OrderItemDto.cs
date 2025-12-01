using Knigarela.Core.Enums;

namespace Knigarela.Api.Dtos.Orders
{
    public class OrderItemDto
    {
        public Guid Id => Guid.NewGuid();

        public Guid BoxId { get; set; }

        public string? BoxTitle { get; set; }

        public int Quantity { get; set; }

        public decimal Price { get; set; }

        public PurchaseType PurchaseType { get; set; }
    }
}

using Knigarela.Core.Enums;

namespace Knigarela.Api.Dtos.Orders
{
    public class OrderItemDto
    {
        public Guid BoxId { get; set; }

        public int Quantity { get; set; }

        public PurchaseType PurchaseType { get; set; }
    }
}

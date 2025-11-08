using Knigarela.Core.Enums;

namespace Knigarela.Api.Dtos.Cart
{
    public class CartItemDto
    {
        public Guid BoxId { get; set; }
        
        public string Title { get; set; }

        public decimal UnitPrice { get; set; }
        
        public int Quantity { get; set; }

        public string ImageUrl { get; set; }

        public PurchaseType PurchaseType { get; set; }
    }
}

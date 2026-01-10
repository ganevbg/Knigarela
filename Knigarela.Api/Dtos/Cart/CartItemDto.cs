using Knigarela.Api.Dtos.Boxes;
using Knigarela.Core.Enums;

namespace Knigarela.Api.Dtos.Cart
{
    public class CartItemDto
    {
        public Guid BoxId { get; set; }
        
        public string? Title { get; set; }

        public decimal UnitPrice { get; set; }
        
        public int Quantity { get; set; }

        public BoxImageDto? Image { get; set; }

        public PurchaseType PurchaseType { get; set; }

        public string PurchaseTypeText => PurchaseType == PurchaseType.Single ? "Еднократно" : "Абонамент";
    }
}

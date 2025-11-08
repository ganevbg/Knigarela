using Knigarela.Core.Enums;

namespace Knigarela.Api.Dtos.Cart
{
    public class CartDto
    {
        public Guid BoxId { get; set; }

        public PurchaseType PurchaseType { get; set; } = PurchaseType.Single;
    }
}

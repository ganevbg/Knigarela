using Knigarela.Api.Dtos.Cart;

namespace Knigarela.Api.Dtos.Orders
{
    public class OrderByIdDto
    {
        public string? Email { get; set; }

        public string? Client { get; set; }

        public string? OrderNumber { get; set; }
        
        public DateTime Date { get; set; }
        
        public string? AddressType { get; set; }

        public string? AddressDetailText { get; set; }

        public List<CartItemDto>? Items { get; set; }

        public decimal DeliveryAmount { get; set; }
        
        public decimal SubTotal { get; set; }
        public decimal TotalAmount => DeliveryAmount + SubTotal;
    }
}

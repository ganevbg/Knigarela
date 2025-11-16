namespace Knigarela.Api.Dtos.Orders
{
    public class CreateOrderRequest : CreateOrderFromCartRequest
    {
        public List<OrderItemDto>? Items { get; set; }
    }
}

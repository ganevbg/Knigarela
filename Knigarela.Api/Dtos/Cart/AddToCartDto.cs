namespace Knigarela.Api.Dtos.Cart
{
    public class AddToCartDto : CartDto
    {
        public int Quantity { get; set; } = 1;
    }
}

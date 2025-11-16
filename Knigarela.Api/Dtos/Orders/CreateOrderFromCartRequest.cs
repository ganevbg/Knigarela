namespace Knigarela.Api.Dtos.Orders
{
    using Knigarela.Core.Entities;

    public class CreateOrderFromCartRequest
    {
        public string? FullName { get; set; }

        public string? Email { get; set; }

        public string? Phone { get; set; }

        public BaseAddress? Address { get; set; }

        public string? Notes { get; set; }
    }
}

using Knigarela.Core.Entities;

namespace Knigarela.Api.Dtos.Orders
{
    public class AdminOrderDto
    {
        public Guid Id { get; set; }

        public string? FullName { get; set; }

        public string? Email { get; set; }

        public string? Phone { get; set; }

        public OrderAddress? Address { get; set; }

        public List<OrderItemDto> Items { get; set; }
    }
}

using Knigarela.Core.Enums;

namespace Knigarela.Api.Dtos.Orders
{
    public class OrderListDto
    {
        public Guid Id { get; set; }

        public string? Number { get; set; }

        public OrderStatus? Status { get; set; }

        public decimal TotalAmount { get; set; }

        public DateTime Date { get; set; }

        public string? ClientName { get; set; }

        public string? Address { get; set; }
    }
}

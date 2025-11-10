using Knigarela.Core.Entities;

namespace Knigarela.Api.Dtos.Orders
{
    public class CreateOrderFromCartRequest
    {
        public string FullName { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public OrderAddress Address { get; set; }

        public string Notes { get; set; }
    }
}

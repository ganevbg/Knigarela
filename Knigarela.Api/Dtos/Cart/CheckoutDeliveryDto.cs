using Knigarela.Core.Enums;

namespace Knigarela.Api.Dtos.Cart
{
    public class CheckoutDeliveryDto
    {
        public DeliveryType DeliveryType { get; set; }

        public int? OfficeId { get; set; }

        public int? SiteId { get; set; }

        public string AddressText { get; set; }
    }
}

using Knigarela.Core.Enums;

namespace Knigarela.Core.Entities
{
    public class BaseAddress : BaseEntity
    {
        public string? AddressText { get; set; }

        public string? SiteId { get; set; }

        public string? SiteName { get; set; }

        public string? OfficeId { get; set; }

        public string? OfficeName { get; set; }

        public DeliveryType DeliveryType { get; set; }
    }
}

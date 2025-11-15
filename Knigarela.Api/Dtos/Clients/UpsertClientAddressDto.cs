using Knigarela.Core.Enums;

namespace Knigarela.Api.Dtos.Clients
{
    public class UpsertClientAddressDto
    {
        public Guid? Id { get; set; }

        public string? AddressText { get; set; }

        public int? SiteId { get; set; }

        public string? SiteName { get; set; }

        public int? OfficeId { get; set; }

        public string? OfficeName { get; set; }

        public DeliveryType DeliveryType { get; set; }

        public bool IsDefault { get; set; }
    }
}

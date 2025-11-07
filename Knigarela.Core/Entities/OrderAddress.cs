using Knigarela.Core.Enums;

namespace Knigarela.Core.Entities;

public class OrderAddress
{
    public string City { get; set; }
    public string AddressText { get; set; }

    public string SiteId { get; set; }
    public string OfficeId { get; set; }
    public string OfficeName { get; set; }

    public string Phone { get; set; }
    public DeliveryType DeliveryType { get; set; }
}

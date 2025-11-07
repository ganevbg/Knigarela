using Knigarela.Core.Enums;

namespace Knigarela.Core.Entities;

public class ClientAddress
{
    public Guid Id { get; set; }
    public Guid ClientId { get; set; }

    public string City { get; set; }
    public string AddressText { get; set; }

    // Courier data (for Speedy)
    public string SiteId { get; set; }
    public string OfficeId { get; set; }
    public string OfficeName { get; set; }

    public DeliveryType Type { get; set; } // Courier / Personal
    public bool IsDefault { get; set; }

    public Client Client { get; set; }
}

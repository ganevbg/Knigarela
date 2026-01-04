using System.Net;

namespace Knigarela.Core.Entities;

public class ClientAddress : BaseAddress
{
    public Guid ClientId { get; set; }

    public Client? Client { get; set; }
}

public sealed class ClientAddressComparer : IEqualityComparer<ClientAddress>
{
    public bool Equals(ClientAddress? x, ClientAddress? y)
    {
        if (ReferenceEquals(x, y)) return true;
        if (x is null || y is null) return false;

        return (x.OfficeId == y.OfficeId && !x.SiteId.HasValue && !y.SiteId.HasValue) || (!x.OfficeId.HasValue && !y.OfficeId.HasValue && x.SiteId == y.SiteId && !string.IsNullOrWhiteSpace(x.AddressText) && !string.IsNullOrWhiteSpace(y.AddressText) && x.AddressText.Equals(y.AddressText));
    }

    public int GetHashCode(ClientAddress obj)
    {
        return obj.Id.GetHashCode();
    }
}
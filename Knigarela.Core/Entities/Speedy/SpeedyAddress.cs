namespace Knigarela.Core.Entities.Speedy
{
    public class SpeedyAddress
    {
        public int CountryId { get; set; }

        public int SiteId { get; set; }

        public string? SiteType { get; set; }

        public string? SiteName { get; set; }

        public string? PostCode { get; set; }

        public string? AddressNote { get; set; }

        public double X { get; set; }

        public double Y { get; set; }

        public string? FullAddressString { get; set; }

        public string? SiteAddressString { get; set; }

        public string? LocalAddressString { get; set; }
    }
}

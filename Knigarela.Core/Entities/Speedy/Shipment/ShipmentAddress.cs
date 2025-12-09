namespace Speedy.Models
{
    public class ShipmentAddress
    {
        public int? CountryId { get; set; }
        public string? StateId { get; set; }
        public int? SiteId { get; set; }
        public string? SiteType { get; set; }
        public string? SiteName { get; set; }
        public int? ComplexId { get; set; }
        public string? ComplexType { get; set; }
        public string? ComplexName { get; set; }
        public int? StreetId { get; set; }
        public string? StreetType { get; set; }
        public string? StreetName { get; set; }
        public string? StreetNo { get; set; }
        public string? BlockNo { get; set; }
        public string? EntranceNo { get; set; }
        public string? FloorNo { get; set; }
        public string? ApartmentNo { get; set; }

        public string? AddressNote{ get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public double? X { get; set; }
        public double? Y { get; set; }
    }
}

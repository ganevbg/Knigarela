namespace Knigarela.Core.Entities.Speedy
{
    public class SpeedySite
    {
        public int Id { get; set; }
        public int CountryId { get; set; }
        public int MainSiteId { get; set; }
        public string Type { get; set; }
        public string TypeEn { get; set; }
        public string Name { get; set; }
        public string NameEn { get; set; }
        public string Municipality { get; set; }
        public string MunicipalityEn { get; set; }
        public string Region { get; set; }
        public string RegionEn { get; set; }
        public string PostCode { get; set; }
        public string ServingDays { get; set; }
        public int AddressNomenclature { get; set; }
        public double X { get; set; } // Longitude
        public double Y { get; set; } // Latitude
        public int ServingOfficeId { get; set; }
        public int ServingHubOfficeId { get; set; }
    }
}

namespace Speedy.Models
{
    public class ShipmentContent
    {
        public int? ParcelsCount { get; set; }
        public decimal? TotalWeight { get; set; }
        public string? Contents { get; set; }
        public string? Package { get; set; }
        public string? PackageId { get; set; }
        public string? ContentType { get; set; }
        public string? UitCode { get; set; }
        public decimal? GoodsValue { get; set; }
        public string? GoodsValueCurrencyCode { get; set; }
        public object? PrintAdditionalBarcode { get; set; }
    }
}

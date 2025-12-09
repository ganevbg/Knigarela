namespace Speedy.Models
{
    public class CreateShipmentResponse
    {
        public string? Id { get; set; }
        public List<CreatedShipmentParcel>? Parcels { get; set; }
        public DateTime? PickupDate { get; set; }
        public string? ServiceTypeName { get; set; }
        public ShipmentPrice? Price { get; set; }
        public DateTime? DeliveryDeadline { get; set; }
        public SpeedyError? Error { get; set; }
    }

    public class CreatedShipmentParcel
    {
        public string? Id { get; set; }
        public int? SeqNo { get; set; }
        public int? ExternalCarrierId { get; set; }
        public string? ExternalCarrierParcelNumber { get; set; }
    }

    public class ShipmentPrice
    {
        public decimal? Amount { get; set; }
        public decimal? Vat { get; set; }
        public decimal? Total { get; set; }
        public string? Currency { get; set; }
        public ShipmentPriceAmount? Amounts { get; set; }
        public int? CurrencyExchangeRateUnit { get; set; }
        public decimal? CurrencyExchangeRate { get; set; }
        public ReturnAmounts? ReturnAmounts { get; set; }
    }

    public class ShipmentPriceAmount { }
    public class ReturnAmounts { }

    public class SpeedyError
    {
        public string? Context { get; set; }
        public string? Message { get; set; }
        public string? Id { get; set; }
        public int? Code { get; set; }
        public string? Component { get; set; }
    }
}

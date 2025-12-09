namespace Knigarela.Core.Entities.Speedy.Shipment
{
    public class ShipmentCODAdditionalService
    {
        public decimal Amount { get; set; }

        public string? CurrencyCode { get; set; }

        public CODProcessingType? ProcessingType { get; set; } = CODProcessingType.CASH;

        public bool? PayoutToThirdParty { get; set; }

        public bool? PayoutToLoggedClient { get; set; }

        public bool? IncludeShippingPrice { get; set; }

        public bool? CardPaymentForbidden { get; set; }

        public ShipmentCODFiscalReceiptItem[]? FiscalReceiptItems { get; set; }
    }

    public enum CODProcessingType
    {
        CASH,
        POSTAL_MONEY_TRANSFER
    }

    public class ShipmentCODFiscalReceiptItem
    {
        public string? Description { get; set; }
        public double? PriceWithoutVAT { get; set; }
        public double? VATPercent { get; set; }
        public double? PriceWithVAT { get; set; }
        public int? Quantity { get; set; }
    }
}

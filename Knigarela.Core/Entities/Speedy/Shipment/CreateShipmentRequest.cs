namespace Speedy.Models
{
    public class CreateShipmentRequest
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string? Language { get; set; } = "BG";
        public long? ClientSystemId { get; set; }
        public ShipmentService Service { get; set; }
        public ShipmentContent Content { get; set; }
        public ShipmentPayment Payment { get; set; }
        public ShipmentSender Sender { get; set; }
        public ShipmentRecipient Recipient { get; set; }
        public bool? PendingShipment { get; set; }
        public string? ShipmentNote { get; set; }
        public string? Ref1 { get; set; }
        public string? Ref2 { get; set; }
        public string? ConsolidationRef { get; set; }
        public bool? RequireUnsuccessfulDeliveryStickerImage { get; set; }
        public string? Id { get; set; }
    }
}

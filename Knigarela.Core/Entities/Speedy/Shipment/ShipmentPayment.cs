namespace Speedy.Models
{
    public class ShipmentPayment
    {
        public ShipmentRole? CourierServicePayer { get; set; }
        public ShipmentRole? DeclaredValuePayer { get; set; }
        public ShipmentRole? PackagePayer { get; set; }
        public int? DiscountCardClientId { get; set; }
        public ShipmentDiscountCardId? DiscountCardId { get; set; }
        public BankAccount? SenderBankAccount { get; set; }
        public bool? AdministrativeFee { get; set; }
    }

    public enum ShipmentRole
    {
        SENDER,
        RECIPIENT,
        THIRD_PARTY
    }

    public class ShipmentDiscountCardId { }
    public class BankAccount { }
}

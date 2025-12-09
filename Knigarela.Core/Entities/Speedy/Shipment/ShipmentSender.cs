namespace Speedy.Models
{
    public class ShipmentSender
    {
        public string? ClientId { get; set; }
        public ShipmentPhoneNumber? Phone1 { get; set; }
        public ShipmentPhoneNumber? Phone2 { get; set; }
        public ShipmentPhoneNumber? Phone3 { get; set; }
        public string? ClientName { get; set; }
        public string? ContactName { get; set; }
        public string? ObjectName { get; set; }
        public string? Email { get; set; }
        public bool? PrivatePerson { get; set; }
        public ShipmentAddress? Address { get; set; }
        public int? DropoffOfficeId { get; set; }
        public string? DropoffGeoPUDOId { get; set; }
    }
}

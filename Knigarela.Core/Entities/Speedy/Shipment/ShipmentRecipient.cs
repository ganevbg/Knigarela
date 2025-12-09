namespace Speedy.Models
{
    public class ShipmentRecipient
    {
        public int? ClientId { get; set; }
        public ShipmentPhoneNumber? Phone1 { get; set; }
        public ShipmentPhoneNumber? Phone2 { get; set; }
        public ShipmentPhoneNumber? Phone3 { get; set; }
        public string? ClientName { get; set; }
        public string? ContactName { get; set; }
        public string? ObjectName { get; set; }
        public string? Email { get; set; }
        public bool PrivatePerson { get; set; } = true;
        public ShipmentAddress? Address { get; set; }
        public int? PickupOfficeId { get; set; }
        public string? PickupGeoPUDOId { get; set; }
        public bool? AutoSelectNearestOffice { get; set; }
        public AutoSelectNearestOfficePolicy? AutoSelectNearestOfficePolicy { get; set; }
    }

    public class ShipmentPhoneNumber
    {
        public string? Number { get; set; }
        public string? Extension { get; set; }
    }

    public class AutoSelectNearestOfficePolicy { }
}

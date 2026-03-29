using Knigarela.Core.Entities.Speedy.Shipment;

namespace Speedy.Models
{
    public class ShipmentService
    {
        public DateOnly? PickupDate { get; set; }
        public int? ServiceId { get; set; }
        public ShipmentAdditionalServices? AdditionalServices { get; set; }
        public int? DeferredDays { get; set; }
        public bool? SaturdayDelivery { get; set; }
        public bool? AutoAdjustPickupDate { get; set; }
        public DeliveryLimitViolationAutoAdjustment? DeliveryLimitViolationAutoAdjustment { get; set; }
    }

    public class ShipmentAdditionalServices 
    {
        public ShipmentCODAdditionalService? Cod { get; set; }
    }

    public class DeliveryLimitViolationAutoAdjustment { }
}

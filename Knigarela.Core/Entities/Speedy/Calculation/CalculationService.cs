namespace Speedy.Models;

public class CalculationService
{
    public DateTime? PickupDate { get; set; }             // date-time
    public bool? AutoAdjustPickupDate { get; set; }
    public List<int>? ServiceIds { get; set; }            // array<int>
    public ShipmentAdditionalServices? AdditionalServices { get; set; }
    public int? DeferredDays { get; set; }
    public bool? SaturdayDelivery { get; set; }
}

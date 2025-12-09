namespace Speedy.Models;

public class CalculationResult
{
    public int? ServiceId { get; set; }
    public ShipmentPrice? Price { get; set; }
    public DateTime? PickupDate { get; set; }
    public DateTime? DeliveryDeadline { get; set; }
    public string? DeliveryDeadlineWorkDayType { get; set; }
    public ShipmentAdditionalServices? AdditionalServices { get; set; }
    public SpeedyError? Error { get; set; }
}

public class WorkDayType
{
    // схемата за WorkDayType я има като $ref, но не е отделен .schema.json;
    // можеш спокойно временно да го оставиш празен или да го направиш string,
    // ако не ти трябва детайлна информация за него.
}

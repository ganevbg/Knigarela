namespace Speedy.Models;

public class CalculationContent
{
    public int? ParcelsCount { get; set; }
    public double? TotalWeight { get; set; }
    public bool? Documents { get; set; }
    public bool? Palletized { get; set; }
    public List<CreatedShipmentParcel>? Parcels { get; set; }
}

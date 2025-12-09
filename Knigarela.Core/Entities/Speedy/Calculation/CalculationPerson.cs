namespace Speedy.Models;

public class CalculationPerson
{
    public string ClientId { get; set; }
    public bool? PrivatePerson { get; set; }
    public AddressLocation? AddressLocation { get; set; }
    public int? PickupOfficeId { get; set; }
    public string? PickupGeoPUDOId { get; set; }
}

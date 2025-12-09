namespace Speedy.Models;

public class CalculationRequest
{
    public string UserName { get; set; }
    public string Password { get; set; }

    public string? Language { get; set; }

    public long? ClientSystemId { get; set; }

    public CalculationPerson? Sender { get; set; }
    public CalculationPerson Recipient { get; set; }
    public CalculationService Service { get; set; }
    public CalculationContent Content { get; set; }
    public ShipmentPayment Payment { get; set; }
}

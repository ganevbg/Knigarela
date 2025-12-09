namespace Speedy.Models
{
    public class ShipmentCalculationResponse
    {
        public SpeedyError? Error { get; set; }
        public List<CalculationResult>? Calculations { get; set; }
    }
}

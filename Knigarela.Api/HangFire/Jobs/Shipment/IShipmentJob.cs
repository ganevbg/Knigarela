namespace Knigarela.Api.HangFire.Jobs.Shipment
{
    public interface IShipmentJob
    {
        Task GenerateAsync();
    }
}

namespace Knigarela.Api.HangFire.Jobs.Order
{
    public interface IOrderJob
    {
        Task GenerateAsync();
    }
}

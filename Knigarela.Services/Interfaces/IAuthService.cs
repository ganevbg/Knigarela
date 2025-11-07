namespace Knigarela.Services.Interfaces
{
    public interface IAuthService
    {
        ////Task<(bool Success, string Message)> RegisterAsync(string email, string fullName, string password);

        Task<(bool Success, string Token, string Message)> LoginAsync(string email, string password);
    }
}

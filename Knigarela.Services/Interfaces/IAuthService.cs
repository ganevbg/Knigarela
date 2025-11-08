namespace Knigarela.Services.Interfaces
{
    public interface IAuthService
    {
        Task<(bool Success, string AccessToken, string RefreshToken, string Message)> LoginAsync(string email, string password);

        Task<(bool Success, string AccessToken, string RefreshToken, string Message)> RefreshAsync(string refreshToken);

        Task LogoutAsync(string userId);
    }
}

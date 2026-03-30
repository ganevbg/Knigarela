namespace Knigarela.Services.Interfaces
{
    public interface IEmailService
    {
        public Task SendEmail(string toEmail, string subject, string body);
    }
}

using Knigarela.Infrastructure.Settings;
using Knigarela.Services.Interfaces;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace Knigarela.Services.Implementations
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings settings;

        public EmailService(IOptions<EmailSettings> settings)
        {
            this.settings = settings.Value;
        }

        public async Task SendEmail(string toEmail, string subject, string body)
        {
            // Set up SMTP client
            var client = new SmtpClient(this.settings.Host, this.settings.Port);
            client.EnableSsl = this.settings.EnableSsl;
            client.Credentials = new NetworkCredential(this.settings.Username, this.settings.Password);

            // Create email message
            MailMessage mailMessage = new MailMessage
            {
                From = new MailAddress(this.settings.FromEmail),
                ReplyTo = new MailAddress(this.settings.FromEmail)
            };
            mailMessage.To.Add(toEmail);
            mailMessage.Subject = subject;
            mailMessage.IsBodyHtml = true;
            mailMessage.Body = body;

            // Send email
            client.Send(mailMessage);
        }
    }
}

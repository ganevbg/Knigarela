namespace Knigarela.Api.Dtos.Clients
{
    public class ClientAllDto
    {
        public Guid Id { get; set; }

        public DateTime CreatedAt { get; set; }

        public string? FullName { get; set; }

        public string? Email { get; set; }

        public string? Phone { get; set; }

        public string? Notes { get; set; }

        public DateOnly? SubscriptionDate { get; set; }

        public int SubscriptionCancellationCount { get; set; }

        public bool IsSubscribed => SubscriptionDate.HasValue;

        public string? DefaultAddress { get; set; }
    }
}

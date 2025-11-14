namespace Knigarela.Api.Dtos.Clients
{
    public class UpsertClientDto
    {
        public Guid? Id { get; set; }

        public string FullName { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public DateOnly? SubscriptionDate { get; set; }
    }
}

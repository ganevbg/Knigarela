namespace Knigarela.Api.Dtos.Boxes
{
    public class AdminBoxDto 
    {
        public Guid Id { get; set; }

        public string Title { get; set; }

        public bool IsActive { get; set; }

        public int Count { get; set; }

        public decimal SinglePrice { get; set; }

        public decimal SubscriptionPrice { get; set; }
    }
}

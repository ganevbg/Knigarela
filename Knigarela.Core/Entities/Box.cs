namespace Knigarela.Core.Entities;

public class Box
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Slug { get; set; }
    public string Description { get; set; }
    public decimal SinglePrice { get; set; }
    public decimal SubscriptionPrice { get; set; }
    public int Count { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public ICollection<BoxImage> Images { get; set; }
}

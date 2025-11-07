namespace Knigarela.Api.Dtos.Boxes;

public class BoxDto
{
    public Guid Id { get; set; }

    public string Title { get; set; }

    public string Slug { get; set; }

    public string Description { get; set; }

    public decimal SinglePrice { get; set; }

    public decimal SubscriptionPrice { get; set; }

    public int Count { get; set; }

    public bool IsActive { get; set; }

    public string? MainImageUrl { get; set; }
}

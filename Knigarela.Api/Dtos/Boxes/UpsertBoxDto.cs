namespace Knigarela.Api.Dtos.Boxes;

public class UpsertBoxDto
{
    public string? Title { get; set; }

    public string? Description { get; set; }

    public decimal SinglePrice { get; set; }

    public decimal SubscriptionPrice { get; set; }

    public int Count { get; set; }

    public bool IsActive { get; set; }
}

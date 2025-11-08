namespace Knigarela.Api.Dtos.Boxes;

public class ActiveBoxDto
{
    public Guid Id { get; set; }

    public string Title { get; set; }

    public string Slug { get; set; }

    public string Description { get; set; }

    public string? MainImageUrl { get; set; }
}

using Knigarela.Core.Entities;

namespace Knigarela.Api.Dtos.Boxes;

public class PrevBoxDto
{
    public string? Title { get; set; }

    public string? Slug { get; set; }

    public BoxImageDto? MainImage { get; set; }
}

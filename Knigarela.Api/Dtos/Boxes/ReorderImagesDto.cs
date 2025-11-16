namespace Knigarela.Api.Dtos.Boxes;
public class ReorderImagesDto
{
    public List<Item>? Items { get; set; }

    public class Item { public Guid ImageId { get; set; } public int SortOrder { get; set; } }
}
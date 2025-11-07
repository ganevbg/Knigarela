namespace Knigarela.Core.Entities;

public class BoxImage : BaseEntity
{
    public Guid BoxId { get; set; }
    
    public string Url { get; set; }
    
    public string ThumbnailUrl { get; set; }
    
    public bool IsMain { get; set; }
    
    public int SortOrder { get; set; }

    public Box Box { get; set; }
}

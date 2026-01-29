using System.ComponentModel.DataAnnotations.Schema;

namespace Knigarela.Core.Entities;

public abstract class BaseEntity
{
    public Guid Id { get; set; }

    [Column(TypeName = "timestamp without time zone")]

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    [Column(TypeName = "timestamp without time zone")]
    public DateTime? UpdatedAt { get; set; }
}

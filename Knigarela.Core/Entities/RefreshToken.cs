using System.ComponentModel.DataAnnotations.Schema;

namespace Knigarela.Core.Entities;

public class RefreshToken
{
    public Guid Id { get; set; }

    public string? Token { get; set; }

    public string? UserId { get; set; }

    [Column(TypeName = "timestamp without time zone")]
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    [Column(TypeName = "timestamp without time zone")]
    public DateTime ExpiresAt { get; set; }

    public bool IsRevoked { get; set; }

    public bool IsExpired => DateTime.Now >= ExpiresAt;
}

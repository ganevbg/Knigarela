namespace Knigarela.Core.Entities;

public class Client
{
    public Guid Id { get; set; }

    public string FullName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }

    public string Notes { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation
    public ICollection<ClientAddress> Addresses { get; set; }
    public ICollection<Order> Orders { get; set; }
}

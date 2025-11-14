namespace Knigarela.Core.Entities;

public class Client : BaseEntity
{
    public string FullName { get; set; }
    
    public string Email { get; set; }
    
    public string Phone { get; set; }

    public string? Notes { get; set; }

    public DateTime? SubscriptionDate { get; set; }

    public int SubscriptionCancellationCount { get; set; }

    public bool IsSubscribed => SubscriptionDate.HasValue;

    // Navigation
    public ICollection<ClientAddress> Addresses { get; set; }
    public ICollection<Order> Orders { get; set; }
}

namespace Knigarela.Core.Entities;

public class Client : BaseEntity
{
    public string? FullName { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string? Notes { get; set; }

    public DateOnly? SubscriptionDate { get; set; }

    public int SubscriptionCancellationCount { get; set; }

    public bool IsNewSubscriber { get; set; }

    public bool IsSubscribed { get; set; }
    // Navigation
    public ICollection<ClientAddress>? Addresses { get; set; }
    public ICollection<Order>? Orders { get; set; }
}

namespace Knigarela.Core.Entities;

public class ClientAddress : BaseAddress
{
    public Guid ClientId { get; set; }

    public Client? Client { get; set; }
}

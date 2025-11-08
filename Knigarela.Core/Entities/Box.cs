using Knigarela.Core.Enums;

namespace Knigarela.Core.Entities;

public class Box : BaseEntity
{
    public string Title { get; set; }

    public string Slug { get; set; }

    public string Description { get; set; }

    public decimal SinglePrice { get; set; }

    public decimal SubscriptionPrice { get; set; }

    public int Count { get; set; }

    public bool IsActive { get; set; }

    public ICollection<BoxImage> Images { get; set; }

    public decimal GetPrice(PurchaseType type)
    {
        return type == PurchaseType.Single ? SinglePrice : SubscriptionPrice;
    }
}

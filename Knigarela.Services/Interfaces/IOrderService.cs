using Knigarela.Core.Entities;
using Knigarela.Core.Enums;

namespace Knigarela.Services.Interfaces;

public interface IOrderService
{
    Task<Order> CreateOrderAsync(
        string fullName,
        string email,
        string phone,
        OrderAddress address,
        List<(Guid BoxId, int Quantity, PurchaseType type)> items,
        string? notes = null
    );

    Task<Order?> GetByIdAsync(Guid id);
    Task<List<Order>> GetAllAsync();

    Task<bool> DeleteAsync(Guid id);
}

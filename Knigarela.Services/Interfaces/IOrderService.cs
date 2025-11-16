using Knigarela.Core.Entities;
using Knigarela.Core.Enums;

namespace Knigarela.Services.Interfaces;

public interface IOrderService
{
    Task<CreateOrderResult> CreateOrderWithStockCheckAsync(
       string fullName,
       string email,
       string phone,
       BaseAddress address,
       List<(Guid BoxId, int Quantity, PurchaseType type)> items,
       string? notes = null,
       bool useLock = false);

    Task<Order?> GetByIdAsync(Guid id);

    Task<List<Order>> GetAllAsync();

    Task<bool> DeleteAsync(Guid id);

}

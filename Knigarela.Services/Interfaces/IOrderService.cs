using Knigarela.Core.Entities;
using Knigarela.Core.Enums;
using Knigarela.Core.Pagination;
using Speedy.Models;

namespace Knigarela.Services.Interfaces;

public interface IOrderService
{
    Task<CreateOrderResult> CreateOrderWithStockCheckAsync(
       string fullName,
       string email,
       string phone,
       OrderAddress address,
       List<(Guid BoxId, int Quantity, PurchaseType type)> items,
       string? notes = null,
       bool useLock = false);

    Task<Order?> GetByIdAsync(Guid id);

    Task<PagedResult<Order>> GetAllAsync(DataQuery<string> query);

    Task<bool> DeleteAsync(Guid id);

    Task<string> PrintLabelsAsync(Guid id, Speedy.Models.PaperSize size);

    Task<string> PrintAllLabelsAsync(PaperSize size);

    Task<List<CreateOrderResult>> CreateOrdersForSubscribersAsync(int quantityPerSubscriber = 1);
}

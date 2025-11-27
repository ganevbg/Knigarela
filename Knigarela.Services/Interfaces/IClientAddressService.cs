using Knigarela.Core.Entities;
using Knigarela.Core.Pagination;

namespace Knigarela.Services.Interfaces;

public interface IClientAddressService
{
    Task<PagedResult<ClientAddress>> GetByClientAsync(Guid clientId, DataQuery<string> query);
    Task<ClientAddress?> GetByIdAsync(Guid id);
    Task<ClientAddress> AddAsync(Guid clientId, ClientAddress address);
    Task<ClientAddress?> UpdateAsync(Guid id, ClientAddress address);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> SetDefaultAsync(Guid clientId, Guid addressId);
}

using Knigarela.Core.Entities;

namespace Knigarela.Services.Interfaces;

public interface IClientAddressService
{
    Task<List<ClientAddress>> GetByClientAsync(Guid clientId);
    Task<ClientAddress?> GetByIdAsync(Guid id);
    Task<ClientAddress> AddAsync(Guid clientId, ClientAddress address);
    Task<ClientAddress?> UpdateAsync(Guid id, ClientAddress address);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> SetDefaultAsync(Guid clientId, Guid addressId);
}

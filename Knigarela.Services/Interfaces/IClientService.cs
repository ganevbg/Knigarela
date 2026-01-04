using Knigarela.Core.Entities;
using Knigarela.Core.Pagination;

namespace Knigarela.Services.Interfaces
{
    public interface IClientService
    {
        Task<Client> FindOrCreateClientAsync(Client model);

        Task<PagedResult<Client>> GetAllAsync(DataQuery<string> query);

        Task<Client?> GetByIdAsync(Guid id);

        Task<Client> CreateAsync(Client client);

        Task<Client?> UpdateAsync(Guid id, Client updated);

        Task<bool> DeleteAsync(Guid id);

        Task<bool> MarkNewAsOldAsync();

        Task<bool> UnsubscribeAsync(Guid id);
    }
}

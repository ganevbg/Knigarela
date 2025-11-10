using Knigarela.Core.Entities;

namespace Knigarela.Services.Interfaces
{
    public interface IClientService
    {
        Task<Client> FindOrCreateClientAsync(Client model);

        Task<List<Client>> GetAllAsync();

        Task<Client?> GetByIdAsync(Guid id);

        Task<Client> CreateAsync(Client client);

        Task<Client?> UpdateAsync(Guid id, Client updated);

        Task<bool> DeleteAsync(Guid id);
    }
}

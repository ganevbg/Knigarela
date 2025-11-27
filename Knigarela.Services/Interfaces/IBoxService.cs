using Knigarela.Core.Entities;
using Knigarela.Core.Pagination;

namespace Knigarela.Services.Interfaces;

public interface IBoxService
{
    Task<IEnumerable<Box>> GetAllAsync();

    Task<PagedResult<Box>> QueryAsync(DataQuery<string> query);

    Task<Box?> GetByIdAsync(Guid id);
    
    Task<Box> CreateAsync(Box box);
    
    Task<Box?> UpdateAsync(Guid id, Box box);

    Task<bool> DeleteAsync(Guid id);

    Task<Box?> GetActiveBox();

    Task<Box?> GetBySlugAsync(string slug);

    Task<IEnumerable<Box>> GetNotActiveBox();
}

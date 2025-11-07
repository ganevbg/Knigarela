using Knigarela.Core.Entities;

namespace Knigarela.Services.Interfaces;

public interface IBoxImageService
{
    Task<IReadOnlyList<BoxImage>> GetByBoxAsync(Guid boxId);
    Task<BoxImage> AddAsync(Guid boxId, string fileName, Stream content, bool isMain = false, int? sortOrder = null);
    Task<bool> DeleteAsync(Guid imageId);
    Task<bool> SetMainAsync(Guid boxId, Guid imageId);
    Task<bool> ReorderAsync(Guid boxId, IReadOnlyList<(Guid imageId, int sortOrder)> order);
    Task<bool> DeleteAllForBoxAsync(Guid boxId);
}

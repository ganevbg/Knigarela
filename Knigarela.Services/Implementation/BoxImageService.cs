using Knigarela.Core.Entities;
using Knigarela.Infrastructure.Data;
using Knigarela.Infrastructure.Files;
using Knigarela.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Knigarela.Services.Implementations;

public class BoxImageService : IBoxImageService
{
    private readonly KnigarelaDbContext _db;
    private readonly IFileStorage _storage;

    public BoxImageService(KnigarelaDbContext db, IFileStorage storage)
    {
        _db = db;
        _storage = storage;
    }

    public async Task<IReadOnlyList<BoxImage>> GetByBoxAsync(Guid boxId) =>
        await _db.Set<BoxImage>().Where(i => i.BoxId == boxId)
            .OrderBy(i => i.SortOrder).ToListAsync();

    public async Task<BoxImage> AddAsync(Guid boxId, string fileName, Stream content, bool isMain = false, int? sortOrder = null)
    {
        var box = await _db.Set<Box>().FirstOrDefaultAsync(b => b.Id == boxId);
        if (box == null) throw new InvalidOperationException("Box not found.");

        var folderName = Path.Combine("boxes", box.Id.ToString());

        var relUrl = await _storage.SaveFileAsync(content, fileName, folderName);

        // reset stream and create thumbnail
        if (content.CanSeek)
            content.Position = 0;
        var thumbUrl = await _storage.SaveThumbnailAsync(content, fileName, folderName);

        if (isMain)
        {
            var others = _db.Set<BoxImage>().Where(i => i.BoxId == boxId && i.IsMain);
            await others.ForEachAsync(i => i.IsMain = false);
        }

        var maxOrder = await _db.Set<BoxImage>()
            .Where(i => i.BoxId == boxId)
            .Select(i => (int?)i.SortOrder)
            .MaxAsync() ?? 0;

        var img = new BoxImage
        {
            BoxId = boxId,
            Url = relUrl,
            ThumbnailUrl = thumbUrl,
            IsMain = isMain,
            SortOrder = sortOrder ?? (maxOrder + 1)
        };

        _db.Add(img);
        await _db.SaveChangesAsync();
        return img;
    }

    public async Task<bool> DeleteAsync(Guid imageId)
    {
        var img = await _db.Set<BoxImage>().FindAsync(imageId);
        if (img == null) return false;
        await _storage.DeleteFileAsync(img.Url);

        // Delete thumbnail (if present)
        if (!string.IsNullOrWhiteSpace(img.ThumbnailUrl))
            await _storage.DeleteFileAsync(img.ThumbnailUrl);

        _db.Remove(img);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> SetMainAsync(Guid boxId, Guid imageId)
    {
        var imgs = await _db.Set<BoxImage>().Where(i => i.BoxId == boxId).ToListAsync();
        if (!imgs.Any(i => i.Id == imageId)) return false;

        foreach (var i in imgs) i.IsMain = i.Id == imageId;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ReorderAsync(Guid boxId, IReadOnlyList<(Guid imageId, int sortOrder)> order)
    {
        var map = order.ToDictionary(x => x.imageId, x => x.sortOrder);
        var imgs = await _db.Set<BoxImage>().Where(i => i.BoxId == boxId).ToListAsync();
        foreach (var i in imgs)
            if (map.TryGetValue(i.Id, out var s)) i.SortOrder = s;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAllForBoxAsync(Guid boxId)
    {
        var images = await _db.Set<BoxImage>().Where(i => i.BoxId == boxId).ToListAsync();
        if (!images.Any()) return false;

        var folder = Path.Combine("boxes", boxId.ToString());
        await _storage.DeleteFolderAsync(folder); // removes all files + thumbs recursively

        _db.RemoveRange(images);
        await _db.SaveChangesAsync();

        return true;
    }

}

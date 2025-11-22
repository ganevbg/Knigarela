using Knigarela.Core.Entities;
using Knigarela.Core.Helpers;
using Knigarela.Core.Pagination;
using Knigarela.Infrastructure.Data;
using Knigarela.Infrastructure.Files;
using Knigarela.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Knigarela.Services.Implementations;

public class BoxService : IBoxService
{
    private readonly KnigarelaDbContext _db;
    private readonly IFileStorage _storage;

    public BoxService(KnigarelaDbContext db, IFileStorage storage)
    {
        _db = db;
        _storage = storage;
    }

    public async Task<IEnumerable<Box>> GetAllAsync() =>
        await _db.Boxes.Include(b => b.Images)
                       .OrderBy(b => b.CreatedAt)
                       .ToListAsync();

    public async Task<Box?> GetByIdAsync(Guid id) =>
        await _db.Boxes.Include(b => b.Images).FirstOrDefaultAsync(b => b.Id == id);

    public async Task<Box> CreateAsync(Box box)
    {
        box.Id = Guid.NewGuid();
        box.CreatedAt = DateTime.UtcNow;
        box.Slug = SlugHelper.GenerateSlug(box.Title);

        // гарантираме уникалност
        var originalSlug = box.Slug;
        int counter = 2;
        while (await _db.Boxes.AnyAsync(x => x.Slug == box.Slug))
            box.Slug = $"{originalSlug}-{counter++}";

        _db.Boxes.Add(box);
        await _db.SaveChangesAsync();
        return box;
    }

    public async Task<Box?> UpdateAsync(Guid id, Box box)
    {
        var existing = await _db.Boxes.FindAsync(id);
        if (existing == null) return null;

        existing.Title = box.Title;
        existing.Description = box.Description;
        existing.SinglePrice = box.SinglePrice;
        existing.SubscriptionPrice = box.SubscriptionPrice;
        existing.Count = box.Count;
        existing.IsActive = box.IsActive;
        existing.UpdatedAt = DateTime.UtcNow;
        existing.Slug = SlugHelper.GenerateSlug(box.Title);

        // проверка за уникалност при промяна
        var slugBase = existing.Slug;
        int i = 2;
        while (await _db.Boxes.AnyAsync(x => x.Slug == existing.Slug && x.Id != existing.Id))
            existing.Slug = $"{slugBase}-{i++}";

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var box = await _db.Boxes.FindAsync(id);
        if (box == null) return false;

        var folder = Path.Combine("boxes", box.Id.ToString());
        await _storage.DeleteFolderAsync(folder); // add this helper if needed

        _db.Boxes.Remove(box);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<Box?> GetActiveBox()
    {
        return await _db.Boxes.Include(b => b.Images).FirstOrDefaultAsync(x => x.IsActive);
    }

    public async Task<Box?> GetBySlugAsync(string slug)
    {
        return await _db.Boxes.Include(b => b.Images).FirstOrDefaultAsync(x => x.Slug.Equals(slug));
    }

    public async Task<IEnumerable<Box>> GetNotActiveBox()
    {
        return await _db.Boxes
            .Include(b => b.Images)
            .Where(x => x.IsActive == false).ToListAsync();
    }

    public async Task<PagedResult<Box>> QueryAsync(PaginationQuery<string> query)
    {
        return await DynamicQuery.ApplyAsync(
         _db.Boxes,
         query,
         filterExpression: query.FilterValue switch
         {
             "active" => b => b.IsActive,
             "inactive" => b => !b.IsActive,
             _ => null
         },
         selectExpression: b => b,
         searchableFields:
         [
            b => b.Title
         ]
        );
    }
}

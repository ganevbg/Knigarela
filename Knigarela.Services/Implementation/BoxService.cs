using Knigarela.Core.Entities;
using Knigarela.Core.Helpers;
using Knigarela.Core.Pagination;
using Knigarela.Infrastructure.Data;
using Knigarela.Infrastructure.Files;
using Knigarela.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace Knigarela.Services.Implementations;

public class BoxService : IBoxService
{
    private readonly KnigarelaDbContext _db;
    private readonly IFileStorage _storage;

    private readonly Dictionary<string, Func<IQueryable<Box>, string, IQueryable<Box>>> _filterMap =
    new()
    {
        ["title"] = (q, v) =>
            string.IsNullOrWhiteSpace(v)
                ? q
                : q.Where(b => b.Title.ToLower().Contains(v.ToLower())),
        ["status"] = (q, v) =>
            v == "all"
                ? q
                : v == "active"
                    ? q.Where(b => b.IsActive)
                    : q.Where(b => !b.IsActive),
        ["count"] = (q, v) =>
            int.TryParse(v, out var num)
                ? q.Where(b => b.Count == num)
                : q,
        ["minCount"] = (q, v) =>
            int.TryParse(v, out var num)
                ? q.Where(b => b.Count >= num)
                : q,
        ["maxCount"] = (q, v) =>
            int.TryParse(v, out var num)
                ? q.Where(b => b.Count <= num)
                : q,
    };

    public BoxService(KnigarelaDbContext db, IFileStorage storage)
    {
        _db = db;
        _storage = storage;
    }

    public sealed class BoxMainComparer : IEqualityComparer<Box>
    {
        public bool Equals(Box? x, Box? y)
        {
            if (ReferenceEquals(x, y)) return true;
            if (x is null || y is null) return false;

            return x.Title == y.Title
                && x.Description == y.Description
                && x.SinglePrice == y.SinglePrice
                && x.SubscriptionPrice == y.SubscriptionPrice
                && x.Count == y.Count
                && x.IsActive == y.IsActive;
        }

        public int GetHashCode(Box obj) =>
            HashCode.Combine(obj.Title, obj.Description, obj.SinglePrice, obj.SubscriptionPrice, obj.Count, obj.IsActive);
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
        box.CreatedAt = DateTime.Now;
        box.Slug = SlugHelper.GenerateSlug(box.Title);

        // гарантираме уникалност
        var originalSlug = box.Slug;
        int counter = 2;
        while (await _db.Boxes.AnyAsync(x => x.Slug == box.Slug))
            box.Slug = $"{originalSlug}-{counter++}";


        _db.Boxes.Add(box);
        await _db.SaveChangesAsync();
        await RemoveOtherActiveBoxFlagsAsync(box);
        return box;
    }

    public async Task<Box?> UpdateAsync(Guid id, Box box)
    {
        var existing = await _db.Boxes.FindAsync(id);
        if (existing == null) return null;

        if (new BoxMainComparer().Equals(existing, box))
            return existing;


        existing.Title = box.Title;
        existing.Description = box.Description;
        existing.SinglePrice = box.SinglePrice;
        existing.SubscriptionPrice = box.SubscriptionPrice;
        existing.Count = box.Count;
        existing.IsActive = box.IsActive;
        existing.UpdatedAt = DateTime.Now;
        existing.Slug = SlugHelper.GenerateSlug(box.Title);

        var slugBase = existing.Slug;
        int i = 2;
        while (await _db.Boxes.AnyAsync(x => x.Slug == existing.Slug && x.Id != existing.Id))
            existing.Slug = $"{slugBase}-{i++}";

        await _db.SaveChangesAsync();

        await RemoveOtherActiveBoxFlagsAsync(existing);

        return existing;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var box = await _db.Boxes.FindAsync(id);
        if (box == null) return false;

        var folder = Path.Combine("boxes", box.Id.ToString());
        await _storage.DeleteFolderAsync(folder);

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

    public async Task<PagedResult<Box>> QueryAsync(DataQuery<string> query)
    {
        return await DynamicQuery.ApplyAsync(_db.Boxes.AsQueryable(), query, b => b, _filterMap);
    }

    private async Task RemoveOtherActiveBoxFlagsAsync(Box box)
    {
        if (box.IsActive)
        {
            await _db.Boxes
            .Where(x => x.IsActive && !x.Id.Equals(box.Id))
            .ExecuteUpdateAsync(s => s.SetProperty(b => b.IsActive, false));
        }

        await _db.SaveChangesAsync();
    }
}

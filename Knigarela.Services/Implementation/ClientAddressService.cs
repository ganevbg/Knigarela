using Knigarela.Core.Entities;
using Knigarela.Core.Enums;
using Knigarela.Core.Pagination;
using Knigarela.Infrastructure.Data;
using Knigarela.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Knigarela.Services;

public class ClientAddressService : IClientAddressService
{
    private readonly KnigarelaDbContext _db;

    private readonly Dictionary<string, Func<IQueryable<ClientAddress>, string, IQueryable<ClientAddress>>> _filterMap =
    new()
    {
        ["addressText"] = (q, v) =>
            string.IsNullOrWhiteSpace(v) ? q :
            q.Where(c => c.AddressText!.ToLower().Contains(v.ToLower()) || c.OfficeName!.ToLower().Contains(v.ToLower())),
        ["deliveryType"] = (q, v) =>
        {
            Enum.TryParse<DeliveryType>(v, ignoreCase: true, out var deliveryType);
            return v == "all"
                 ? q
                 : q.Where(o => o.DeliveryType == deliveryType);
        },
    };

    public ClientAddressService(KnigarelaDbContext db)
    {
        _db = db;
    }

    public async Task<PagedResult<ClientAddress>> GetByClientAsync(Guid clientId, DataQuery<string> query)
    {
        var data = _db.ClientAddresses.Where(a => a.ClientId == clientId).AsQueryable();

        return await DynamicQuery.ApplyAsync(data, query, a => a, _filterMap);
    }

    public async Task<ClientAddress?> GetByIdAsync(Guid id)
    {
        return await _db.ClientAddresses.FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<ClientAddress> AddAsync(Guid clientId, ClientAddress address)
    {
        address.Id = Guid.NewGuid();
        address.ClientId = clientId;

        // If this is the first address for the client, set as default
        bool hasDefault = await _db.ClientAddresses.AnyAsync(a => a.ClientId == clientId && a.IsDefault);
        if (!hasDefault)
            address.IsDefault = true;

        if (address.IsDefault)
        {
            var otherAddresses = await _db.ClientAddresses
                .Where(a => a.ClientId == address.ClientId && a.Id != address.Id)
                .ToListAsync();

            foreach (var item in otherAddresses)
            {
                item.IsDefault = false;
            }
        }

        _db.ClientAddresses.Add(address);
        await _db.SaveChangesAsync();
        return address;
    }

    public async Task<ClientAddress?> UpdateAsync(Guid id, ClientAddress updated)
    {
        var existing = await _db.ClientAddresses.FindAsync(id);
        if (existing == null) return null;

        existing.UpdatedAt = DateTime.UtcNow;
        existing.SiteName = updated.SiteName;
        existing.SiteId = updated.SiteId;
        existing.OfficeName = updated.OfficeName;
        existing.OfficeId = updated.OfficeId;
        existing.AddressText = updated.AddressText;
        existing.DeliveryType = updated.DeliveryType;
        existing.IsDefault = updated.IsDefault;

        if (updated.IsDefault)
        {
            var otherAddresses = await _db.ClientAddresses
                .Where(a => a.ClientId == existing.ClientId && a.Id != existing.Id)
                .ToListAsync();

            foreach (var item in otherAddresses)
            {
                item.IsDefault = false;
            }
        }

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var address = await _db.ClientAddresses.FindAsync(id);
        if (address == null) return false;

        _db.ClientAddresses.Remove(address);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> SetDefaultAsync(Guid clientId, Guid addressId)
    {
        var addresses = await _db.ClientAddresses
            .Where(a => a.ClientId == clientId)
            .ToListAsync();

        if (!addresses.Any()) return false;

        foreach (var addr in addresses)
            addr.IsDefault = addr.Id == addressId;

        await _db.SaveChangesAsync();
        return true;
    }
}

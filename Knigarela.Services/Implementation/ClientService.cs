using Knigarela.Core.Entities;
using Knigarela.Core.Enums;
using Knigarela.Infrastructure.Data;
using Knigarela.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

public class ClientService : IClientService
{
    private readonly KnigarelaDbContext _db;
    private readonly ISpeedyService _speedy;
    private static readonly Regex PhoneRegex =
        new(@"^(0\d{9}|\+359\d{9}|00359\d{9})$", RegexOptions.Compiled);

    public ClientService(KnigarelaDbContext db, ISpeedyService speedy)
    {
        _db = db;
        _speedy = speedy;
    }

    public async Task<Client> FindOrCreateClientAsync(Client model)
    {
        var normName = model.FullName.Trim().ToLowerInvariant();
        var normEmail = model.Email?.Trim().ToLowerInvariant();
        var normPhone = NormalizePhone(model.Phone);
        var normPhoneDigits = Regex.Replace(normPhone, @"\D", "");

        var existing = await _db.Clients
            .Where(c =>
                EF.Property<string>(c, "email_normalized") == normEmail ||
                EF.Property<string>(c, "phone_normalized") == normPhoneDigits)
            .Where(c => EF.Property<string>(c, "fullname_normalized") == normName)
            .FirstOrDefaultAsync();

        if (existing != null)
            return existing;

        return await CreateClientAsync(model);
    }

    public async Task<List<Client>> GetAllAsync()
    {
        return await _db.Clients
            .Include(c => c.Addresses)
            .Include(c => c.Orders)
            .ThenInclude(o => o.Items)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<Client?> GetByIdAsync(Guid id)
    {
        return await _db.Clients
            .Include(c => c.Addresses)
            .Include(c => c.Orders)
            .ThenInclude(o => o.Items)
            .ThenInclude(i => i.Box)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Client> CreateAsync(Client client)
    {
        return await CreateClientAsync(client);
    }

    public async Task<Client?> UpdateAsync(Guid id, Client updated)
    {
        var existing = await _db.Clients
            .Include(c => c.Addresses)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (existing == null) return null;

        await ValidateCourierAddressesAsync(updated);

        _db.Entry(existing).CurrentValues.SetValues(updated);
        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var client = await _db.Clients
            .Include(c => c.Addresses)
            .Include(c => c.Orders)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (client == null) return false;

        _db.Clients.Remove(client);
        await _db.SaveChangesAsync();
        return true;
    }

    private async Task<Client> CreateClientAsync(Client client)
    {
        await ValidateCourierAddressesAsync(client);
        client.CreatedAt = DateTime.UtcNow;

        _db.Clients.Add(client);
        await _db.SaveChangesAsync();
        return client;
    }

    private async Task ValidateCourierAddressesAsync(Client client)
    {
        if (client.Addresses == null || client.Addresses.Count == 0)
            return;

        foreach (var address in client.Addresses)
        {
            if (address.DeliveryType == DeliveryType.Courier)
            {
                if (!string.IsNullOrWhiteSpace(address.OfficeId) &&
                    !await _speedy.ValidateOfficeAsync(address.OfficeId))
                    throw new InvalidOperationException($"Invalid Speedy office ID: {address.OfficeId}");
            }

            if (!string.IsNullOrWhiteSpace(address.SiteId) && !await _speedy.ValidateSiteAsync(address.SiteId))
                throw new InvalidOperationException($"Invalid Speedy site ID: {address.SiteId}");
        }
    }

    private static string NormalizePhone(string phone)
    {
        if (string.IsNullOrWhiteSpace(phone)) return string.Empty;
        phone = phone.Trim();

        if (!PhoneRegex.IsMatch(phone))
            throw new ArgumentException("Invalid Bulgarian phone format.");

        if (phone.StartsWith("00"))
            phone = "+" + phone.Substring(2);
        else if (phone.StartsWith("0"))
            phone = "+359" + phone.Substring(1);

        return phone;
    }
}

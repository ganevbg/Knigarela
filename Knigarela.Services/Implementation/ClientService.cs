using Knigarela.Core.Entities;
using Knigarela.Infrastructure.Data;
using Knigarela.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Text.RegularExpressions;

public class ClientService : IClientService
{
    private readonly KnigarelaDbContext _db;
    private static readonly Regex PhoneRegex =
        new(@"^(0\d{9}|\+359\d{9}|00359\d{9})$", RegexOptions.Compiled);

    public ClientService(KnigarelaDbContext db)
    {
        _db = db;
    }

    public async Task<Client> FindOrCreateClientAsync(string fullName, string email, string phone)
    {
        var normName = fullName.Trim().ToLowerInvariant();
        var normEmail = email?.Trim().ToLowerInvariant();
        var normPhone = NormalizePhone(phone);
        var normPhoneDigits = Regex.Replace(normPhone, @"\D", "");

        var existing = await _db.Clients
            .Where(c =>
                EF.Property<string>(c, "email_normalized") == normEmail ||
                EF.Property<string>(c, "phone_normalized") == normPhoneDigits)
            .Where(c => EF.Property<string>(c, "fullname_normalized") == normName)
            .FirstOrDefaultAsync();

        if (existing != null)
            return existing;

        var client = new Client
        {
            Id = Guid.NewGuid(),
            FullName = fullName,
            Email = email,
            Phone = normPhone,
            CreatedAt = DateTime.UtcNow
        };

        _db.Clients.Add(client);
        await _db.SaveChangesAsync();
        return client;
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
        client.CreatedAt = DateTime.UtcNow;
        _db.Clients.Add(client);
        await _db.SaveChangesAsync();
        return client;
    }

    public async Task<Client?> UpdateAsync(Guid id, Client updated)
    {
        var existing = await _db.Clients.FindAsync(id);
        if (existing == null) return null;

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

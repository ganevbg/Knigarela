using Knigarela.Core.Entities;
using Knigarela.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Text.RegularExpressions;

public class ClientService
{
    private readonly KnigarelaDbContext _db;
    private static readonly Regex PhoneRegex =
        new(@"^(0\d{9}|\+359\d{9}|00359\d{9})$", RegexOptions.Compiled);

    public ClientService(KnigarelaDbContext db)
    {
        _db = db;
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
}

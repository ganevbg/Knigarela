using Knigarela.Core.Entities;
using Knigarela.Core.Enums;
using Knigarela.Core.Pagination;
using Knigarela.Infrastructure.Data;
using Knigarela.Services;
using Knigarela.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Text.RegularExpressions;

public class ClientService : IClientService
{
    private readonly KnigarelaDbContext _db;
    private readonly ISpeedyService _speedy;
    private readonly IClientAddressService clientAddressService;

    private static readonly Regex PhoneRegex =
        new(@"^(0\d{9}|\+359\d{9}|00359\d{9})$", RegexOptions.Compiled);

    private readonly Dictionary<string, Func<IQueryable<Client>, string, IQueryable<Client>>> _filterMap =
    new()
    {
        ["name"] = (q, v) =>
            string.IsNullOrWhiteSpace(v) ? q :
            q.Where(c => c.FullName!.ToLower().Contains(v.ToLower())),
        ["email"] = (q, v) =>
            string.IsNullOrWhiteSpace(v) ? q :
            q.Where(c => c.Email!.ToLower().Contains(v.ToLower())),
        ["phone"] = (q, v) =>
            string.IsNullOrWhiteSpace(v) ? q :
            q.Where(c => c.Phone!.Contains(v)),
        ["isSubscribed"] = (q, v) =>
            v == "all" ? q :
            v == "true" ? q.Where(c => c.IsSubscribed) :
            q.Where(c => !c.IsSubscribed),
        ["isNewSubscriber"] = (q, v) =>
            v == "all" ? q :
            v == "true" ? q.Where(c => c.IsNewSubscriber) :
            q.Where(c => !c.IsNewSubscriber),
    };

    public ClientService(KnigarelaDbContext db, ISpeedyService speedy, IClientAddressService clientAddressService)
    {
        _db = db;
        _speedy = speedy;
        this.clientAddressService = clientAddressService;
    }

    public async Task<Client> FindOrCreateClientAsync(Client model)
    {
        var normName = model?.FullName?.Trim().ToLowerInvariant();
        var normEmail = model?.Email?.Trim().ToLowerInvariant();
        var normPhone = NormalizePhone(model?.Phone);
        var normPhoneDigits = Regex.Replace(normPhone, @"\D", "");

        var existing = await _db.Clients
            .Where(c =>
                EF.Property<string>(c, "email_normalized") == normEmail ||
                EF.Property<string>(c, "phone_normalized") == normPhoneDigits)
            .Where(c => EF.Property<string>(c, "fullname_normalized") == normName)
            .Include(x => x.Addresses)
            .FirstOrDefaultAsync();

        if (existing != null)
        {
            var tmpAddress = model?.Addresses?.FirstOrDefault();
            if (existing.Addresses != null && tmpAddress != null && !existing.Addresses.Contains(tmpAddress, new ClientAddressComparer()))
            {
                await clientAddressService.AddAsync(existing.Id, tmpAddress);
            }

            if (existing.SubscriptionDate == null)
            {
                existing.SubscriptionDate = model?.SubscriptionDate;
                existing.IsNewSubscriber = model?.SubscriptionDate.HasValue == true;
                existing.IsSubscribed = model?.SubscriptionDate.HasValue == true;
            }

            await _db.SaveChangesAsync();

            return existing;
        }

        model.Phone = normPhone;

        return await CreateClientAsync(model);
    }

    public async Task<PagedResult<Client>> GetAllAsync(DataQuery<string> query)
    {
        return await DynamicQuery.ApplyAsync(_db.Clients.Include(c => c.Addresses).AsQueryable(), query, c => c, _filterMap);
    }

    public async Task<Client?> GetByIdAsync(Guid id)
    {
        return await _db.Clients
            .Include(c => c.Addresses!)
            .Include(c => c.Orders!)
            .ThenInclude(o => o.Items!)
            .ThenInclude(i => i.Box)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Client> CreateAsync(Client client)
    {
        client.IsNewSubscriber = client.SubscriptionDate.HasValue;
        client.IsSubscribed = client.SubscriptionDate.HasValue;
        return await CreateClientAsync(client);
    }

    public async Task<Client?> UpdateAsync(Guid id, Client updated)
    {
        var existing = await _db.Clients
            .FirstOrDefaultAsync(c => c.Id == id);

        if (existing == null) return null;


        existing.FullName = updated.FullName;
        existing.Email = updated.Email;
        existing.Phone = updated.Phone;
        existing.SubscriptionDate = updated.SubscriptionDate.HasValue ? updated.SubscriptionDate.Value : existing.SubscriptionDate;
        existing.IsNewSubscriber = updated.SubscriptionDate.HasValue;
        existing.IsSubscribed = updated.SubscriptionDate.HasValue;
        existing.UpdatedAt = DateTime.Now;

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
        client.CreatedAt = DateTime.Now;

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
                var officeString = address.OfficeId.ToString();
                if (!string.IsNullOrWhiteSpace(officeString) &&
                    !await _speedy.ValidateOfficeAsync(officeString))
                    throw new InvalidOperationException($"Invalid Speedy office ID: {address.OfficeId}");
            }

            // todo - remove that ugly fix and store muncipality, region, settlement or whatever they are called in speedy api and use that
            var siteString = !string.IsNullOrWhiteSpace(address.SiteName) ? address.SiteName?.Split(",")[2].Split('.')[1] : null;
            if (!string.IsNullOrWhiteSpace(siteString) && !await _speedy.ValidateSiteAsync(siteString))
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

    public async Task<bool> MarkNewAsOldAsync()
    {
        var newSubscribers = _db.Clients.Where(c => c.IsNewSubscriber);
        foreach (var client in newSubscribers)
        {
            client.IsNewSubscriber = false;
        }

        return await _db.SaveChangesAsync().ContinueWith(t => t.Result > 0);
    }

    public async Task<bool> UnsubscribeAsync(Guid id)
    {
        var existing = await _db.Clients
            .FirstOrDefaultAsync(c => c.Id == id);

        if (existing == null) return false;

        existing.SubscriptionDate = null;
        existing.IsSubscribed = false;
        existing.IsNewSubscriber = false;
        existing.SubscriptionCancellationCount++;

       return await _db.SaveChangesAsync().ContinueWith(t => t.Result > 0);
    }
}

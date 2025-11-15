using Knigarela.Core.Entities.Speedy;
using Knigarela.Infrastructure.Settings;
using Knigarela.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Text;
using System.Text.Json;

public class SpeedyService : ISpeedyService
{
    private readonly HttpClient _http;
    private readonly ILogger<SpeedyService> _logger;
    private readonly SpeedySettings _settings;

    public SpeedyService(HttpClient http, ILogger<SpeedyService> logger, IOptions<SpeedySettings> settings)
    {
        _http = http;
        _logger = logger;
        _settings = settings.Value;

        _http.BaseAddress = new Uri(_settings.BaseUrl);
        _http.Timeout = TimeSpan.FromSeconds(_settings.TimeoutSeconds);
    }

    public async Task<bool> ValidateSiteAsync(string siteId)
    {
        if (string.IsNullOrWhiteSpace(siteId))
            return false;

        try
        {
            var response = await SearchSite(siteId);
            return response.Any();
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to validate Speedy site {SiteId}", siteId);
            return false;
        }
    }

    public async Task<bool> ValidateOfficeAsync(string officeId)
    {
        if (string.IsNullOrWhiteSpace(officeId))
            return false;

        try
        {
            var response = await SearchOffice(officeId);
            return response.Any();
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to validate Speedy office {OfficeId}", officeId);
            return false;
        }
    }

    public async Task<List<SpeedyOffice>> SearchOffice(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return new List<SpeedyOffice>();

        try
        {
            var content = new StringContent(
                       JsonSerializer.Serialize(new
                       {
                           userName = _settings.Username,
                           password = _settings.Password,
                           name = name.Trim()
                       }),
                       Encoding.UTF8,
                       "application/json"
                   );

            var response = await _http.PostAsync($"location/office", content);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();

            var officeResult = JsonSerializer.Deserialize<SpeedyOfficeResult>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (officeResult == null || officeResult.Offices.Count == 0)
                return new List<SpeedyOffice>();


            return officeResult.Offices;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to search Speedy office with query {q}", name);
            return new List<SpeedyOffice>();
        }
    }

    public async Task<List<SpeedySite>> SearchSite(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return new List<SpeedySite>();

        try
        {
            var content = new StringContent(
                       JsonSerializer.Serialize(new
                       {
                           userName = _settings.Username,
                           password = _settings.Password,
                           countryId = _settings.CountryId,
                           name = name.Trim()
                       }),
                       Encoding.UTF8,
                       "application/json"
                   );

            var response = await _http.PostAsync($"location/site", content);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();

            var result = JsonSerializer.Deserialize<SpeedySiteResult>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (result == null || result.Sites.Count == 0)
                return new List<SpeedySite>();


            return result.Sites;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to search Speedy site with query {q}", name);
            return new List<SpeedySite>();
        }
    }
}

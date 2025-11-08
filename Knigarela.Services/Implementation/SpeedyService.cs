using Knigarela.Infrastructure.Settings;
using Knigarela.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

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
            var response = await _http.GetAsync($"/location/site/{siteId}");
            return response.IsSuccessStatusCode;
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
            var response = await _http.GetAsync($"/location/offices/{officeId}");
            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to validate Speedy office {OfficeId}", officeId);
            return false;
        }
    }
}

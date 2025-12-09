namespace Knigarela.Infrastructure.Settings;

public class SpeedySettings
{
    public string? BaseUrl { get; set; }

    public string? Username { get; set; }

    public string? Password { get; set; }

    public int CountryId { get; set; } = 100;

    public int TimeoutSeconds { get; set; } = 30;

    public string? SenderClientId { get; set; }

    public string? SenderName { get; set; }

    public string? SenderPhone { get; set; }

    public int? SenderSiteId { get; set; }

    public string? SenderOfficeId { get; set; }

    public string? SenderFullAddress { get; set; }

    public string Currency { get; set; } = "BGN"; // Default

    public int ServiceId { get; set; } = 505; // Default
}

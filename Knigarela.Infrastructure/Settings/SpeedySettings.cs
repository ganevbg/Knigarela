namespace Knigarela.Infrastructure.Settings;

public class SpeedySettings
{
    public string BaseUrl { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public int TimeoutSeconds { get; set; } = 30;
}

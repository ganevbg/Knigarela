namespace Knigarela.Services.Interfaces;

public interface ISpeedyService
{
    Task<bool> ValidateSiteAsync(string siteId);
    Task<bool> ValidateOfficeAsync(string officeId);
}

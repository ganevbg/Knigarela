using Knigarela.Core.Entities.Speedy;

namespace Knigarela.Services.Interfaces;

public interface ISpeedyService
{
    Task<bool> ValidateSiteAsync(string siteId);

    Task<bool> ValidateOfficeAsync(string officeId);

    Task<List<SpeedyOffice>> SearchOffice(string q);

    Task<List<SpeedySite>> SearchSite(string name);
}

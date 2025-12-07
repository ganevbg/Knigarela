using Knigarela.Core.Entities;
using Knigarela.Core.Entities.Speedy;

namespace Knigarela.Services.Interfaces;

public interface ISpeedyService
{
    Task<bool> ValidateSiteAsync(string siteId);

    Task<bool> ValidateOfficeAsync(string officeId);

    Task<List<SpeedyOffice>> SearchOfficeAsync(string q);

    Task<List<SpeedySite>> SearchSiteAsync(string name);

    Task<object> CreateShipmentAsync(Order order);
}

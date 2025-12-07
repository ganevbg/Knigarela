using Knigarela.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class SpeedyController : ControllerBase
{
    private readonly ISpeedyService speedyService;
    public SpeedyController(ISpeedyService speedyService)
    {
        this.speedyService = speedyService;
    }

    [HttpGet("sites")]
    public async Task<IActionResult> Cities([FromQuery] string name)
    {
        if (string.IsNullOrEmpty(name))
            return Ok(Array.Empty<object>());

        var cities = await speedyService.SearchSiteAsync(name);

        if (cities != null && cities.Any())
            return Ok(cities.Select(x => new { id = x.Id, name = $"{x.Region}, {x.Municipality}, {x.Type} {x.Name}, ПК: {x.PostCode}" })); // placeholder

        return Ok(Array.Empty<object>());
    }

    [HttpGet("offices")]
    public async Task<IActionResult> Offices(string? name)
    {
        if (string.IsNullOrEmpty(name))
            return Ok(Array.Empty<object>());

        var offices = await speedyService.SearchOfficeAsync(name);

        if(offices != null && offices.Any())
            return Ok(offices.Select(x => new { id = x.Id, name = x.Name })); // placeholder

        return Ok(Array.Empty<object>());
    }
}

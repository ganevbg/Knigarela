using Knigarela.Api.Dtos.Boxes;
using Knigarela.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Knigarela.Api.Controllers;

[ApiController]
[Route("api/boxes/{boxId:guid}/images")]
[Authorize(Roles = "Admin")]
public class BoxImagesController : ControllerBase
{
    private readonly IBoxImageService boxImageService;
    public BoxImagesController(IBoxImageService boxImageService) { this.boxImageService = boxImageService; }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> List(Guid boxId)
        => Ok(await boxImageService.GetByBoxAsync(boxId));

    [RequestSizeLimit(20_000_000)] // ~20MB
    [HttpPost]
    public async Task<IActionResult> Upload(Guid boxId, IFormFile file, [FromForm] bool isMain = false)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file provided.");

        using var stream = file.OpenReadStream();
        var img = await boxImageService.AddAsync(boxId, file.FileName, stream, isMain);
        return Ok(img);
    }

    [HttpDelete("{imageId:guid}")]
    public async Task<IActionResult> Delete(Guid boxId, Guid imageId)
        => (await boxImageService.DeleteAsync(imageId)) ? NoContent() : NotFound();

    [HttpPost("{imageId:guid}/main")]
    public async Task<IActionResult> SetMain(Guid boxId, Guid imageId)
        => (await boxImageService.SetMainAsync(boxId, imageId)) ? Ok() : NotFound();

    [HttpPost("reorder")]
    public async Task<IActionResult> Reorder(Guid boxId, [FromBody] ReorderImagesDto body)
    {
        var ok = await boxImageService.ReorderAsync(boxId, body.Items.Select(x => (x.ImageId, x.SortOrder)).ToList());
        return ok ? Ok() : NotFound();
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteAll(Guid boxId)
    {
        var deleted = await boxImageService.DeleteAllForBoxAsync(boxId);
        return deleted ? NoContent() : NotFound();
    }
}

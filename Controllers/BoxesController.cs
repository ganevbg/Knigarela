using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class BoxesController : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public IActionResult CreateBox() => Ok("Box created (only admin can do this)");
}

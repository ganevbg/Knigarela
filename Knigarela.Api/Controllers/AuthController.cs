using Knigarela.Api.Dtos.Auth;
using Knigarela.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Knigarela.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService, IConfiguration configuration)
    {
        _authService = authService;
    }

    ////[HttpPost("register")]
    ////public async Task<IActionResult> Register(RegisterDto dto)
    ////{
    ////    var result = await _authService.RegisterAsync(dto.Email, dto.FullName, dto.Password);
    ////    if (!result.Success)
    ////        return BadRequest(result.Message);
    ////    return Ok(result.Message);
    ////}

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto.Email, dto.Password);
        if (!result.Success)
            return Unauthorized(result.Message);

        return Ok(new
        {
            token = $"Bearer {result.Token}",
        });
    }
}

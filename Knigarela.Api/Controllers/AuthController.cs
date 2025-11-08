using Knigarela.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;

    public AuthController(IAuthService auth)
    {
        _auth = auth;
    }

    public record LoginRequest(string Email, string Password);
    public record RefreshRequest(string RefreshToken);

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var result = await _auth.LoginAsync(req.Email, req.Password);
        if (!result.Success)
            return Unauthorized(new { result.Message });

        return Ok(new
        {
            accessToken = result.AccessToken,
            refreshToken = result.RefreshToken
        });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequest req)
    {
        var result = await _auth.RefreshAsync(req.RefreshToken);
        if (!result.Success)
            return Unauthorized(new { result.Message });

        return Ok(new
        {
            accessToken = result.AccessToken,
            refreshToken = result.RefreshToken
        });
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (userId == null)
            return Unauthorized();

        await _auth.LogoutAsync(userId);
        return Ok(new { message = "Logged out successfully" });
    }
}

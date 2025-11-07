using Knigarela.Infrastructure.Identity;
using Knigarela.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Knigarela.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _config;

    public AuthService(UserManager<ApplicationUser> userManager, IConfiguration config)
    {
        _userManager = userManager;
        _config = config;
    }

    ////public async Task<(bool Success, string Message)> RegisterAsync(string email, string fullName, string password)
    ////{
    ////    var user = new ApplicationUser
    ////    {
    ////        UserName = email,
    ////        Email = email,
    ////        FullName = fullName
    ////    };

    ////    var result = await _userManager.CreateAsync(user, password);
    ////    if (!result.Succeeded)
    ////        return (false, string.Join("; ", result.Errors.Select(e => e.Description)));

    ////    // по желание - автоматично присвояване на роля Customer
    ////    await _userManager.AddToRoleAsync(user, "Customer");

    ////    return (true, "User registered successfully");
    ////}

    public async Task<(bool Success, string Token, string Message)> LoginAsync(string email, string password)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null) return (false, "", "Invalid email or password");

        if (!await _userManager.CheckPasswordAsync(user, password))
            return (false, "", "Invalid email or password");

        var token = GenerateJwtToken(user);
        return (true, token, "Login successful");
    }

    private string GenerateJwtToken(ApplicationUser user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email ?? ""),
            new("fullname", user.FullName ?? "")
        };

        // 🔹 добавяме ролите
        var roles = _userManager.GetRolesAsync(user).Result;
        claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

        var token = new JwtSecurityToken(
            expires: DateTime.UtcNow.AddMinutes(int.Parse(_config["Jwt:ExpiresInMinutes"] ?? "120")),
            claims: claims,
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

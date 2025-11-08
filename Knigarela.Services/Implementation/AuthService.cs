using Knigarela.Core.Entities;
using Knigarela.Infrastructure.Data;
using Knigarela.Infrastructure.Identity;
using Knigarela.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace Knigarela.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly KnigarelaDbContext _db;
    private readonly IConfiguration _config;

    public AuthService(UserManager<ApplicationUser> userManager, KnigarelaDbContext db, IConfiguration config)
    {
        _userManager = userManager;
        _db = db;
        _config = config;
    }

    public async Task<(bool Success, string AccessToken, string RefreshToken, string Message)> LoginAsync(string email, string password)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null) return (false, "", "", "Invalid email or password");

        if (!await _userManager.CheckPasswordAsync(user, password))
            return (false, "", "", "Invalid email or password");

        var roles = await _userManager.GetRolesAsync(user);
        var accessToken = GenerateJwtToken(user, roles);
        var refreshToken = await CreateRefreshTokenAsync(user);

        return (true, accessToken, refreshToken.Token, "Login successful");
    }

    public async Task<(bool Success, string AccessToken, string RefreshToken, string Message)> RefreshAsync(string refreshToken)
    {
        var existing = await _db.RefreshTokens.FirstOrDefaultAsync(t => t.Token == refreshToken && !t.IsRevoked);
        if (existing == null || existing.IsExpired)
            return (false, "", "", "Invalid or expired refresh token");

        var user = await _userManager.FindByIdAsync(existing.UserId);
        if (user == null)
            return (false, "", "", "User not found");

        existing.IsRevoked = true;
        var roles = await _userManager.GetRolesAsync(user);
        var newAccess = GenerateJwtToken(user, roles);
        var newRefresh = await CreateRefreshTokenAsync(user);

        await _db.SaveChangesAsync();
        return (true, newAccess, newRefresh.Token, "Token refreshed");
    }

    public async Task LogoutAsync(string userId)
    {
        var tokens = await _db.RefreshTokens
            .Where(t => t.UserId == userId && !t.IsRevoked)
            .ToListAsync();

        foreach (var t in tokens)
            t.IsRevoked = true;

        await _db.SaveChangesAsync();
    }

    private string GenerateJwtToken(ApplicationUser user, IList<string> roles)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email ?? ""),
            new("fullname", user.FullName ?? "")
        };
        claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

        var token = new JwtSecurityToken(
            expires: DateTime.UtcNow.AddMinutes(int.Parse(_config["Jwt:ExpiresInMinutes"] ?? "30")),
            claims: claims,
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private async Task<RefreshToken> CreateRefreshTokenAsync(ApplicationUser user)
    {
        var token = new RefreshToken
        {
            Id = Guid.NewGuid(),
            Token = Guid.NewGuid().ToString("N"),
            UserId = user.Id,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            IsRevoked = false
        };

        _db.RefreshTokens.Add(token);
        await _db.SaveChangesAsync();
        return token;
    }
}

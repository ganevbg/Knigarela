using Microsoft.AspNetCore.Identity;
namespace Knigarela.Infrastructure.Identity
{
    public class ApplicationUser : IdentityUser
    {
        public string? FullName { get; set; }
    }
}

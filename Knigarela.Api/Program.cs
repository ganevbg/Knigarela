using Knigarela.Api.Configuration;
using Knigarela.Api.Mapping;
using Knigarela.Core.Interfaces;
using Knigarela.Infrastructure.Data;
using Knigarela.Infrastructure.Files;
using Knigarela.Infrastructure.Identity;
using Knigarela.Services;
using Knigarela.Services.Implementations;
using Knigarela.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// DbContext
builder.Services.AddDbContext<KnigarelaDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<KnigarelaDbContext>()
    .AddDefaultTokenProviders();

// JWT
var jwtKey = builder.Configuration["Jwt:Key"] ?? "SuperSecretKey12345";
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = key,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// DI
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    }); ;

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Knigarela API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header. Example: 'Bearer {token}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<MappingConfiguration>();
});

// infrastructure
builder.Services.AddScoped<IFileStorageSettings, FileStorageSettings>();
builder.Services.AddScoped<IFileStorage, LocalFileStorage>();

// services
builder.Services.AddScoped<IBoxService, BoxService>();
builder.Services.AddScoped<IBoxImageService, BoxImageService>();
builder.Services.AddScoped<IClientService, ClientService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IClientAddressService, ClientAddressService>();

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();

app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var config = services.GetRequiredService<IConfiguration>();
    var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

    var adminSection = config.GetSection("AdminUser");
    var adminUserName = adminSection["UserName"];
    var adminEmail = adminSection["Email"];
    var adminName = adminSection["FullName"];
    var adminPassword = adminSection["Password"];

    if (!await roleManager.RoleExistsAsync("Admin"))
        await roleManager.CreateAsync(new IdentityRole("Admin"));

    var admin = await userManager.FindByEmailAsync(adminEmail);
    if (admin == null)
    {
        var newAdmin = new ApplicationUser
        {
            UserName = adminUserName,
            Email = adminEmail,
            FullName = adminName
        };

        var result = await userManager.CreateAsync(newAdmin, adminPassword);
        if (result.Succeeded)
            await userManager.AddToRoleAsync(newAdmin, "Admin");
        else
            Console.WriteLine("Failed to create admin: " + string.Join(", ", result.Errors.Select(e => e.Description)));
    }
}

app.Run();

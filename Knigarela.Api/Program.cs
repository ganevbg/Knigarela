using Hangfire;
using Hangfire.PostgreSql;
using Knigarela.Api.Configuration;
using Knigarela.Api.HangFire;
using Knigarela.Api.HangFire.Jobs.Shipment;
using Knigarela.Api.Mapping;
using Knigarela.Api.Midleware;
using Knigarela.Core.Interfaces;
using Knigarela.Infrastructure.Data;
using Knigarela.Infrastructure.Files;
using Knigarela.Infrastructure.Identity;
using Knigarela.Infrastructure.Settings;
using Knigarela.Services;
using Knigarela.Services.Implementations;
using Knigarela.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.File("logs/app-.log", rollingInterval: RollingInterval.Day)
    .WriteTo.Console()
    .Enrich.FromLogContext()
    .CreateLogger();

builder.Host.UseSerilog();

// DbContext
builder.Services.AddDbContext<KnigarelaDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddHangfire(config =>
{
    config.UsePostgreSqlStorage(o => o.UseNpgsqlConnection(builder.Configuration.GetConnectionString("Default")));
});

builder.Services.AddHangfireServer();

GlobalJobFilters.Filters.Add(new AutomaticRetryAttribute
{
    Attempts = 0,
    LogEvents = false
});

// Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<KnigarelaDbContext>()
    .AddDefaultTokenProviders();

// JWT
var jwtKey = builder.Configuration["Jwt:Key"];
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey ?? Guid.NewGuid().ToString()));

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

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.Cookie.Name = ".Knigarela.Session";
    options.IdleTimeout = TimeSpan.FromDays(7); // cart persists for a week
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddAuthorization();

// Bind the config section
builder.Services.Configure<SpeedySettings>(
    builder.Configuration.GetSection("Speedy"));

// Register the HTTP client with typed config
builder.Services.AddHttpClient<ISpeedyService, SpeedyService>();

// DI
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddControllers(options =>
{
    options.Filters.Add<ApiExceptionFilter>();
})
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
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
            Array.Empty<string>()
        }
    });
});

builder.Services.AddAutoMapper(cfg =>
{
    cfg.LicenseKey = builder.Configuration["AutoMapper"];
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

builder.Services.AddScoped<IShipmentJob, ShipmentJob>();
builder.Services.AddHttpClient<ISpeedyService, SpeedyService>();

var allowedOrigins = builder.Configuration
    .GetSection("AllowedFrontendOrigins")
    .Get<string[]>() ?? [];

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

app.UseHangfireDashboard("/hangfire");
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Knigarela API v1");
    c.RoutePrefix = "swagger";

    // Optional — restrict Swagger UI to allowed origins only
    // (useful when deployed behind reverse proxy)
    var env = app.Environment.EnvironmentName;
    Console.WriteLine($"Swagger available in {env} environment.");
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(builder.Configuration["FileStorage:RootPath"] ?? "wwwroot\\upload")),
    RequestPath = "/uploads"
});

app.UseSession();
app.UseCors("FrontendPolicy");

app.UseSerilogRequestLogging();
app.UseMiddleware<ErrorHandlingMiddleware>();

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

    if (!string.IsNullOrEmpty(adminUserName) && !string.IsNullOrEmpty(adminEmail) && !string.IsNullOrEmpty(adminName) && !string.IsNullOrEmpty(adminPassword))
    {
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
}

app.Run();

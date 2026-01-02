using Application;
using Application.Features.CandDocs.Queries;
using Application.Service;
using Domain.Entities.Security;
using Domain.InterfacesServices;
using Domain.InterfacesServices.Security;
using ImageMagick;
using Infrastructure.Exceptions;
using Insfrastructure;
using Insfrastructure.Mapper;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;
using WebAPI.Extensions;


const string DefaultConnectionString = "DefaultConnection";

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;

var gsPath = builder.Configuration["ImageMagick:GhostscriptPath"];

if (!string.IsNullOrWhiteSpace(gsPath) && Directory.Exists(gsPath))
{
    ImageMagick.MagickNET.SetGhostscriptDirectory(gsPath);
    builder.Logging.AddConsole();
    Console.WriteLine($"Ghostscript directory set to: {gsPath}");
}

// ======================================================
# region LARGE FILE UPLOAD SETTINGS (VERY IMPORTANT)
// ======================================================

// 👉 Allow uploads up to 500 MB (adjust if needed)
long maxUploadSize = 500 * 1024 * 1024;

// ---- 1) Kestrel limits ----
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = maxUploadSize; // Unlimited = null

    // LONG-RUNNING REQUESTS (IMPORT / OCR)
    options.Limits.KeepAliveTimeout = TimeSpan.FromHours(12);
    options.Limits.RequestHeadersTimeout = TimeSpan.FromHours(12);
});

// ---- 2) ASP.NET Core Form limits ----
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = maxUploadSize;
    
});

// ---- 3) Increase limit for Swagger (UI uploads) ----
builder.Services.Configure<IISServerOptions>(options =>
{
    options.MaxRequestBodySize = maxUploadSize;
});

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});

// ---- 4) IIS Express web.config will override these values,
// but we set them here so Kestrel also allows large requests.
#endregion
// ======================================================
// ========================================
// Core Services
// ========================================
builder.Services.AddAutoMapper(typeof(AutoMapping));
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddHttpClient();

// ========================================
// Authentication & Authorization
// ========================================
builder.Services.AddJwtAuthentication(configuration);

// ========================================
// Controllers & JSON Options
// ========================================
builder.Services.AddControllers(options =>
{
    options.Filters.Add<GlobalExceptionFilter>();
})
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});

// ========================================
// Swagger Documentation
// ========================================
builder.Services.AddSwaggerDocumentation();

// ========================================
// CORS
// ========================================
//builder.Services.AddCors();
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });

    options.AddPolicy("ProdCors", policy =>
    {
        policy
            .WithOrigins("http://gcebc.local", "http://api.gcebc.local")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});


// ========================================
// Database
// ========================================
var connectionString = builder.Configuration.GetConnectionString(DefaultConnectionString)
    ?? throw new InvalidOperationException($"Connection string '{DefaultConnectionString}' is not configured.");
builder.Services.AddDatabaseContext(connectionString);

// ========================================
// Application Services & Infrastructure
// ========================================
builder.Services.AddInfrastructureStores();
builder.Services.AddApplicationServices();

builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(GetImportErrorDetailQuery).Assembly));
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(SearchDocumentQuery).Assembly));




var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseCors("DevCors");
}
else
{
    app.UseCors("ProdCors");
}
// ======================================================
// MIDDLEWARE: Allow large requests even when proxied
// ======================================================
app.Use(async (context, next) =>
{
    var bodyLimitFeature = context.Features.Get<IHttpMaxRequestBodySizeFeature>();
    if (bodyLimitFeature != null && !bodyLimitFeature.IsReadOnly)
        bodyLimitFeature.MaxRequestBodySize = maxUploadSize;

    await next();
});

// ========================================
// Configure Middleware Pipeline
// ========================================
app.ConfigureSwaggerUI();
//app.ConfigureCors();

// ========================================
// Database Seeding
// ========================================

if (!app.Environment.IsEnvironment("Test"))
{
    await app.Services.SeedDatabaseAsync();
}

// ========================================
// Request Pipeline
// ========================================
app.ConfigureMiddlewarePipeline();
app.MapControllers();

app.Run();

public partial class Program { }





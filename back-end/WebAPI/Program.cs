using Application;
using Application.Service;
using Domain.Entities.Security;
using Domain.InterfacesServices.Security;
using Infrastructure.Exceptions;
using Insfrastructure;
using Insfrastructure.Mapper;
using Microsoft.AspNetCore.Identity;
using System.Text.Json.Serialization;
using WebAPI.Extensions;


const string DefaultConnectionString = "DefaultConnection";

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

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
builder.Services.AddCors();

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





var app = builder.Build();

// ========================================
// Configure Middleware Pipeline
// ========================================
app.ConfigureSwaggerUI();
app.ConfigureCors();

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





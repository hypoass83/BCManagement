using System;
using System.IO;
using System.Linq;
using Domain.Entities.Security;
using Infrastructure.Context;
using Insfrastructure.Initialiser;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Tests.IntegrationTests.Base
{
    public class CustomWebApplicationFactory<TProgram> : WebApplicationFactory<TProgram>
        where TProgram : class
    {
        private SqliteConnection? _connection;
        private string? _dbFilePath;

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Test");
            builder.ConfigureServices(services =>
            {
                // Remove any existing context
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<FsContext>));
                if (descriptor != null)
                    services.Remove(descriptor);

                // ✅ Create a guaranteed unique SQLite file per factory
                _dbFilePath = Path.Combine(
                    Path.GetTempPath(),
                    $"fs_testdb_{Guid.NewGuid():N}.sqlite");

                // ✅ Open and keep connection alive for the factory lifetime
                _connection = new SqliteConnection($"Data Source={_dbFilePath};Cache=Shared");
                _connection.Open();

                services.AddDbContext<FsContext>(options =>
                {
                    options.UseSqlite(_connection);
                    options.EnableSensitiveDataLogging();
                });

                services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

                // Build provider
                var sp = services.BuildServiceProvider();

                

                using (var scope = sp.CreateScope())
                {
                    var scopedServices = scope.ServiceProvider;
                    var db = scopedServices.GetRequiredService<FsContext>();
                    var passwordHasher = scopedServices.GetRequiredService<IPasswordHasher<User>>();
                    var logger = scopedServices.GetRequiredService<ILogger<CustomWebApplicationFactory<TProgram>>>();

                    try
                    {
                      
                        db.Database.EnsureCreated();

                       
                        if (!db.Users.Any())
                        {
                            InventoryInitializer.Seed(db, passwordHasher);
                            db.SaveChanges();
                        }

                        logger.LogInformation("✅ Test database created and seeded.");
                    }
                    catch (Exception ex)
                    {
                        logger.LogError(ex, "❌ Error seeding the test database.");
                        throw;
                    }
                }
            });
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);

            try
            {
               
                _connection?.Close();
                _connection?.Dispose();

                
                System.Threading.Thread.Sleep(100);

            
                if (!string.IsNullOrEmpty(_dbFilePath) && File.Exists(_dbFilePath))
                {
                    File.Delete(_dbFilePath);
                }
            }
            catch
            {
                // swallow cleanup errors
            }
        }
    }
}

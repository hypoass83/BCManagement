using Infrastructure.Context;
using Infrastructure.Initialiser;
using Insfrastructure.Initialiser;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Domain.Entities.Security;

namespace WebAPI.Extensions
{
    public static class DatabaseExtensions
    {
        public static IServiceCollection AddDatabaseContext(this IServiceCollection services, string connectionString)
        {
            services.AddDbContext<FsContext>(options =>
            {
                options.UseLazyLoadingProxies()
                       .UseSqlServer(connectionString, sqlOptions =>
                       {
                           sqlOptions.CommandTimeout(120);
                       });
            });

            return services;
        }

        public static async Task SeedDatabaseAsync(this IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var services = scope.ServiceProvider;

            try
            {
                var context = services.GetRequiredService<FsContext>();
                await context.Database.MigrateAsync();

                var passwordHasher = services.GetRequiredService<IPasswordHasher<User>>();
                InventoryInitializer.Seed(context, passwordHasher);
                ConfigurationInitialiser.Seed(context);
            }
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "An error occurred while seeding the database.");
                throw;
            }
        }
    }
}

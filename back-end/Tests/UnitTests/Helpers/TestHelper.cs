using Infrastructure.Context;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Insfrastructure.Initialiser;
using Microsoft.AspNetCore.Identity;
using Domain.Entities.Security;

namespace Tests.UnitTests.Helpers
{
    public static class TestHelper
    {
        public static FsContext GetSqliteInMemoryContext(bool persist = false)
        {
            // Utiliser une base unique par test (évite les collisions FK)
            var connectionString = persist
                ? "Data Source=TestDatabase.db;"
                : $"DataSource=file:memdb_{Guid.NewGuid()}?mode=memory&cache=shared";

            var connection = new SqliteConnection(connectionString);
            connection.Open();

            var options = new DbContextOptionsBuilder<FsContext>()
                .UseSqlite(connection)
                .EnableSensitiveDataLogging()
                .Options;

            var context = new FsContext(options);
            context.Database.EnsureCreated();

            var passwordHasher = new PasswordHasher<User>();

            // Seed seulement si la base est vide
            if (!context.Users.Any())
                InventoryInitializer.Seed(context, passwordHasher);

            return context;
        }

        public static IMapper GetMapper()
        {
            var configExpr = new MapperConfigurationExpression();
            var config = new MapperConfiguration(configExpr);
            return config.CreateMapper();
        }
    }
}

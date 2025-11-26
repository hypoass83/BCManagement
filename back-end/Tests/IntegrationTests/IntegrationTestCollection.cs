using Tests.IntegrationTests.Base;
using Xunit;

[CollectionDefinition("IntegrationTests")]
public class IntegrationTestCollection : ICollectionFixture<CustomWebApplicationFactory<Program>>
{
    // This ensures all test classes use the same factory & DB
}

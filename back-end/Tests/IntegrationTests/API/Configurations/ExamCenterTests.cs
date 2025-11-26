using Xunit;
using System.Net.Http.Json;
using Domain.DTO;
using Tests.IntegrationTests.Base;

namespace IntegrationTests.API.Configurations;

[Collection("IntegrationTestCollection")]
public class ExamCenterTests : IntegrationTestBase<Program>
{
    private readonly HttpClient _client;

    public ExamCenterTests(CustomWebApplicationFactory<Program> factory) : base(factory)
    {
        _client = factory.CreateClient();
    }

    //[Fact]
    //public async Task InsertExamCenter_Should_Return_Success()
    //{
    //    // Arrange
    //    var center = new ExamCenterCreateDTO
    //    {
    //        CenterNumber = 5100,
    //        CenterName = "BUEA TOWN GOV SCHOOL",
    //        Region = "SW",
    //        Division = "Fako"
    //    };

    //    // Act
    //    var response = await _client.PostAsJsonAsync("/api/config/exam-centers", center);

    //    // Assert
    //    response.EnsureSuccessStatusCode();

    //    var result = await response.Content.ReadAsStringAsync();
    //    Assert.Contains("success", result.ToLower());
    //}
}

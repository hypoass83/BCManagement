using Xunit;
using System.Net.Http.Json;
using Domain.DTO;
using Tests.IntegrationTests.Base;

namespace IntegrationTests.API.CandDocs;

[Collection("IntegrationTestCollection")]
public class OcrTests : IntegrationTestBase<Program>
{
    private readonly HttpClient _client;

    public OcrTests(CustomWebApplicationFactory<Program> factory) : base(factory)
    {
        _client = factory.CreateClient();
    }

    //[Fact]
    //public async Task Ocr_Should_Return_Text()
    //{
    //    // Arrange
    //    var pdfBytes = File.ReadAllBytes(Path.Combine("TestData", "single_page.pdf"));

    //    var request = new OcrRequestDTO
    //    {
    //        PdfBase64 = Convert.ToBase64String(pdfBytes)
    //    };

    //    // Act
    //    var response = await _client.PostAsJsonAsync("/api/canddocs/ocr", request);

    //    // Assert
    //    response.EnsureSuccessStatusCode();

    //    var result = await response.Content.ReadAsStringAsync();
    //    Assert.NotNull(result);
    //    Assert.True(result.Length > 10); // Basic validation
    //}
}

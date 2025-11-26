using Xunit;
using System.Net.Http.Json;
using Domain.DTO;
using System.IO;
using Domain.DTO.CandDocs;
using Tests.IntegrationTests.Base;
using System.Net.Http.Headers;
using System.Net;
using System.Text.Json;

namespace IntegrationTests.API.CandDocs;

[Collection("IntegrationTests")]
public class UploadBatchTests : IntegrationTestBase<Program>
{
    private readonly HttpClient _client;

    public UploadBatchTests(CustomWebApplicationFactory<Program> factory) : base(factory) 
    {
        _client = factory.CreateClient();
    }

    
    [Fact]
    public async Task UploadBatch_Should_Return_Success()
    {
        // Arrange
        var pdfPath = Path.Combine("TestData", "2025_5100_13028_003.pdf");
        var pdfBytes = File.ReadAllBytes(pdfPath);

        using var content = new MultipartFormDataContent();

        // The "File" string MUST match the property name in UploadDocumentForm
        var fileContent = new ByteArrayContent(pdfBytes);
        fileContent.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
        content.Add(fileContent, "File", "2025_5100_13028_003.pdf");

        // Add the other form fields
        content.Add(new StringContent("2025"), "ExamYear");
        content.Add(new StringContent("5100"), "ExamCode");
        content.Add(new StringContent("13028"), "CenterNumber");

        // Act
        var response = await _client.PostAsync("/api/Document/upload", content);

        //Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        //var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        //var text = json.GetProperty("text").GetString();

        //Assert.False(string.IsNullOrWhiteSpace(text));

        //// Assert
        response.EnsureSuccessStatusCode();

        var body = await response.Content.ReadAsStringAsync();
        Assert.Contains("savedfile", body.ToLower());
    }
}

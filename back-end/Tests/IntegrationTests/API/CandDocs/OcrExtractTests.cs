using Application.Features.CandDocs.Commands;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Tests.IntegrationTests.Base;
using System.Text.Json;

namespace IntegrationTests.API.CandDocs
{
    [Collection("IntegrationTestCollection")]
    public class OcrExtractTests : IntegrationTestBase<Program>
    {
        private readonly System.Net.Http.HttpClient _client;

        public OcrExtractTests(CustomWebApplicationFactory<Program> factory) : base(factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task Form_Ocr_Extract_Should_Return_Text()
        {
            var pdfPath = Path.Combine("TestData", "2025_5100_13028_003.pdf");
            var pdfBytes = File.ReadAllBytes(pdfPath);

            var content = new MultipartFormDataContent
        {
            { new ByteArrayContent(pdfBytes), "pdfFile", "test.pdf" },
            { new StringContent("1"), "pageNumber" }
        };

            var response = await _client.PostAsync("/api/Document/ocr-extract-form", content);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var json = await response.Content.ReadFromJsonAsync<JsonElement>();
            var text = json.GetProperty("text").GetString();

            Assert.False(string.IsNullOrWhiteSpace(text));
        }


        [Fact]
        public async Task Json_Ocr_Extract_Should_Return_Text()
        {
            var pdfPath = Path.Combine("TestData", "2025_5100_13028_003.pdf");
            var pdfBytes = await File.ReadAllBytesAsync(pdfPath);
            var request = new ExtractOcrFromPage1
            {
                PdfFile = pdfBytes,
                PageNumber = 1
            };

            var response = await _client.PostAsJsonAsync("/api/Document/ocr-extract", request);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var json = await response.Content.ReadFromJsonAsync<JsonElement>();
            var text = json.GetProperty("text").GetString();

            Assert.False(string.IsNullOrWhiteSpace(text));
        }

        [Fact]
        public async System.Threading.Tasks.Task Ocr_Extract_Should_Return_Text()
        {
            //var pdfPath = "/mnt/data/2025_5100_13028_003.pdf"; // sample you uploaded earlier
            var pdfPath = Path.Combine("TestData", "2025_5100_13028_003.pdf");
            var pdfBytes = await File.ReadAllBytesAsync(pdfPath);

            var request = new ExtractOcrFromPage1
            {
                PdfFile = pdfBytes,
                PageNumber = 1
            };

            var response = await _client.PostAsJsonAsync("/api/Document/ocr-extract", request);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var json = await response.Content.ReadFromJsonAsync<System.Text.Json.JsonElement>();
            Assert.True(json.TryGetProperty("text", out var textElement));
            var text = textElement.GetString();
            Assert.False(string.IsNullOrWhiteSpace(text));
            // Optionally: assert contains specific label or candidate number
            // Assert.Contains("Candidate", text, StringComparison.OrdinalIgnoreCase);
        }
    }
}

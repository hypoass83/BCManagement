using Xunit;
using System.Net.Http.Json;
using Domain.DTO;
using Domain.DTO.CandDocs;
using Tests.IntegrationTests.Base;

namespace IntegrationTests.API.CandDocs;

[Collection("IntegrationTestCollection")]
public class SearchCandidateTests : IntegrationTestBase<Program>
{
    private readonly HttpClient _client;

    public SearchCandidateTests(CustomWebApplicationFactory<Program> factory) : base(factory)
    {
        _client = factory.CreateClient();
    }

    //[Fact]
    //public async Task SearchCandidate_Should_Return_Results()
    //{
    //    // SEED manually into InMemory DB
    //    var seed = new CandidateDocumentCreateDTO
    //    {
    //        CandidateNumber = "510013028",
    //        CandidateName = "JOHN DOE",
    //        ExamCenterId = 1001,
    //        Year = 2025,
    //        Page1Path = "test1.pdf",
    //        Page2Path = "test2.pdf"
    //    };

    //    await _client.PostAsJsonAsync("/api/canddocs/add", seed);

    //    // SEARCH
    //    var searchRequest = new CandidateSearchDTO
    //    {
    //        Name = "JOHN",
    //        Year = 2025
    //    };

    //    var response = await _client.PostAsJsonAsync("/api/canddocs/search", searchRequest);

    //    response.EnsureSuccessStatusCode();

    //    var list = await response.Content.ReadFromJsonAsync<List<CandidateDocumentDTO>>();

    //    Assert.NotNull(list);
    //    Assert.True(list.Count > 0);
    //}
}

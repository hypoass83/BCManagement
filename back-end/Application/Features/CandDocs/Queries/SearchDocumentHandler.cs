using Application.Features.CandDocs.Queries;
using Domain.Entities.CandDocs;
using Domain.InterfacesStores.CandDocs;

namespace BCDocumentManagement.Application.Features.CandDocs.Queries
{
    public class SearchDocumentHandler
    {
        private readonly ICandidateRepository _repo;

        public SearchDocumentHandler(ICandidateRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<CandidateDocument>> HandleAsync(SearchDocumentQuery query, CancellationToken ct = default)
        {
            var raw = await _repo.SearchAsync(query.CandidateName, query.CandidateNumber, query.CenterNumber);

            // simple pagination
            var paged = raw.Skip((Math.Max(1, query.Page) - 1) * query.PageSize)
                           .Take(query.PageSize)
                           .ToList();

            return paged;
        }
    }
}

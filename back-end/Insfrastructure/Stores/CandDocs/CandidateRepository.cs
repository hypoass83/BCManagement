using Domain.InterfacesStores.CandDocs;

using Domain.Entities.CandDocs;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Context;

namespace BCDocumentManagement.Infrastructure.Stores.CandDocs
{
    public class CandidateRepository : ICandidateRepository
    {
        private readonly FsContext _db;

        public CandidateRepository(FsContext db)
        {
            _db = db;
        }

        public async Task AddCandidateDocumentAsync(CandidateDocument document)
        {
            _db.CandidateDocuments.Add(document);
            await _db.SaveChangesAsync();
        }

        public async Task<List<CandidateDocument>> SearchAsync(string name, string candidatenumber, string centerNumber)
        {
            return await _db.CandidateDocuments
                .Where(x =>
                    (string.IsNullOrEmpty(name) || x.CandidateName.Contains(name)) &&
                    (string.IsNullOrEmpty(centerNumber) || x.CentreCode == centerNumber) &&
                    (string.IsNullOrEmpty(candidatenumber) || x.CandidateNumber == candidatenumber))
                .ToListAsync();
        }
    }
}

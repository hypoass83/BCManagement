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
        public async Task UpdateAsync(CandidateDocument doc)
        {
            _db.CandidateDocuments.Update(doc);
            await _db.SaveChangesAsync();
        }

        public async Task<List<CandidateDocument>> GetInvalidDocumentsAsync()
        {
            return await _db.CandidateDocuments
                .Where(x => !x.IsValid)
                .OrderBy(x => x.Id)
                .ToListAsync();
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

        public async Task<CandidateDocument> GetByIdAsync(int id)
        {
            return await _db.CandidateDocuments
                .Include(x => x.ImportErrors)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<List<CandidateDocument>> GetValidDocumentsAsync()
        {
            return await _db.CandidateDocuments
                .Where(x => x.IsValid)
                .OrderBy(x => x.Id)
                .ToListAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _db.SaveChangesAsync();
        }

        public async Task<List<CandidateDocument>> GetInvalidWithErrorsAsync()
        {
            return await _db.CandidateDocuments
                .Where(x => !x.IsValid)
                .Include(x => x.ImportErrors)
                .ToListAsync();
        }
        public async Task<List<CandidateDocument>> GetErrorsByCentreAsync(string centre)
        {
            return await _db.CandidateDocuments
                .Where(x => x.CentreCode == centre && !x.IsValid)
                .Include(x => x.ImportErrors)
                .ToListAsync();
        }
    }
}

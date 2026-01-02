using Domain.DTO.CandDocs;
using Domain.Entities.CandDocs;
using Domain.InterfacesStores.CandDocs;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.CandDocs
{
    public class CandidateRepository : ICandidateRepository
    {
        private readonly FsContext _ctx;
        public CandidateRepository(FsContext ctx) => _ctx = ctx;

        public async Task<CandidateDocument> AddAsync(CandidateDocument doc)
        {
            var ent = await _ctx.CandidateDocuments.AddAsync(doc);
            await _ctx.SaveChangesAsync();
            return ent.Entity;
        }

        public async Task UpdateAsync(CandidateDocument doc)
        {
            _ctx.CandidateDocuments.Update(doc);
            await _ctx.SaveChangesAsync();
        }

        public Task<CandidateDocument?> GetByIdAsync(int id)
            => _ctx.CandidateDocuments.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);

        public Task<List<CandidateDocument>> GetDocumentsAsync(int session, string centre)
        {
            return _ctx.CandidateDocuments
                       .Where(x => x.Session == session && x.CentreCode == centre)
                       .OrderBy(x => x.CandidateNumber)
                       .ToListAsync();
        }

        public async Task AddImportErrorsAsync(IEnumerable<ImportError> errors)
        {
            await _ctx.ImportErrors.AddRangeAsync(errors);
            await _ctx.SaveChangesAsync();
        }

        public IQueryable<CandidateDocument> Search(
           string name,
           string? candidateNumber,
           string? centerNumber,
           string? examCode,
           int? session
       )
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Candidate name is required", nameof(name));

            IQueryable<CandidateDocument> query = _ctx.CandidateDocuments;

            // 🔴 Recherche principale (obligatoire)
            query = query.Where(x =>
                x.CandidateName != null &&
                x.CandidateName.Contains(name)
            );

            // 🟢 Filtres optionnels
            if (!string.IsNullOrWhiteSpace(candidateNumber))
                query = query.Where(x =>
                    x.CandidateNumber != null &&
                    x.CandidateNumber.Contains(candidateNumber)
                );

            if (!string.IsNullOrWhiteSpace(centerNumber))
                query = query.Where(x => x.CentreCode == centerNumber);

            if (!string.IsNullOrWhiteSpace(examCode))
                query = query.Where(x => x.ExamCode == examCode);

            if (session.HasValue)
                query = query.Where(x => x.Session == session.Value);

            return query;
        }



        public async Task<List<CandidateDocument>> SearchAsync(string name, string candidatenumber, string centerNumber)
        {
            return await _ctx.CandidateDocuments
                .Where(x =>
                    (string.IsNullOrEmpty(name) || x.CandidateName.Contains(name)) &&
                    (string.IsNullOrEmpty(centerNumber) || x.CentreCode == centerNumber) &&
                    (string.IsNullOrEmpty(candidatenumber) || x.CandidateNumber == candidatenumber))
                .ToListAsync();
        }

        public async Task<bool> HasBatchBeenImportedAsync(string fileName, int year, string examCode, string center)
        {
            return await _ctx.ImportedBatchLogs.AnyAsync(x =>
                x.FileName == fileName &&
                x.ExamYear == year &&
                x.ExamCode == examCode &&
                x.CentreNumber == center);
        }

        public async Task DeleteDocumentsForBatchAsync(int year, string examCode, string center)
        {
            var docs = _ctx.CandidateDocuments
                .Where(x => x.Session == year && x.CentreCode == center && x.ExamCode == examCode);

            _ctx.CandidateDocuments.RemoveRange(docs);
            await _ctx.SaveChangesAsync();
        }

        public async Task LogImportedBatchAsync(string fileName, int year, string examCode, string center)
        {
            var log = new ImportedBatchLog
            {
                FileName = fileName,
                ExamYear = year,
                ExamCode = examCode,
                CentreNumber = center,
                ImportedAt = DateTime.UtcNow
            };

            _ctx.ImportedBatchLogs.Add(log);
            await _ctx.SaveChangesAsync();
        }

        public async Task<List<ImportedBatchDTO>> GetImportedBatchesAsync()
        {
            return await _ctx.ImportedBatchLogs
                .OrderByDescending(x => x.ImportedAt)
                .Select(x => new ImportedBatchDTO
                {
                    Id = x.Id,
                    FileName = x.FileName,
                    ExamYear = x.ExamYear,
                    ExamCode = x.ExamCode,
                    CentreNumber = x.CentreNumber,
                    ImportedAt = x.ImportedAt
                })
                .ToListAsync();
        }

        public async Task<List<ImportedFilesDto>> GetImportedFilesAsync(List<string> fileNames)
        {
            return await _ctx.ImportedBatchLogs
                .Where(x => fileNames.Contains(x.FileName))
               .Select(x => new ImportedFilesDto
                {
                   fileNames = x.FileName
                })
                .ToListAsync();
        }

        public async Task<List<(string, string)>> GetExistingCandidatesAsync(int examYear, string examCode)
        {
            return await _ctx.CandidateDocuments
                .Where(d => d.Session == examYear && d.ExamCode == examCode)
                .Select(d => new ValueTuple<string, string>(
                    d.CandidateNumber,
                    d.CandidateName
                ))
                .ToListAsync();
        }

    }
}


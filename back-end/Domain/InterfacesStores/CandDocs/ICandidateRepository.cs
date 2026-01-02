using Domain.DTO.CandDocs;
using Domain.Entities.CandDocs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.InterfacesStores.CandDocs
{
    public interface ICandidateRepository
    {
        Task<CandidateDocument> AddAsync(CandidateDocument doc);
        Task UpdateAsync(CandidateDocument doc);
        Task<CandidateDocument?> GetByIdAsync(int id);
        Task<List<CandidateDocument>> GetDocumentsAsync(int session, string centre);
        Task AddImportErrorsAsync(IEnumerable<ImportError> errors);
        Task<List<CandidateDocument>> SearchAsync(string name, string candidatenumber, string centerNumber);
        IQueryable<CandidateDocument> Search(
           string name,
           string? candidateNumber,
           string? centerNumber,
           string? examCode,
           int? session
       );

        Task<bool> HasBatchBeenImportedAsync(string fileName, int year, string examCode, string center);
        Task DeleteDocumentsForBatchAsync(int year, string examCode, string center);
        Task LogImportedBatchAsync(string fileName, int year, string examCode, string center);
        Task<List<ImportedBatchDTO>> GetImportedBatchesAsync();
        Task<List<ImportedFilesDto>> GetImportedFilesAsync(List<string> fileNames);

        Task<List<(string CandidateNumber, string CandidateName)>> GetExistingCandidatesAsync(int examYear,string examCode);
    }
}

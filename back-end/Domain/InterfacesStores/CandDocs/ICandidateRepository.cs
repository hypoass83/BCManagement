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
        Task AddCandidateDocumentAsync(CandidateDocument document);
        Task<List<CandidateDocument>> SearchAsync(string name, string candidatenumber, string centerNumber);
        
        Task<CandidateDocument> GetByIdAsync(int id);
        Task UpdateAsync(CandidateDocument doc);
        Task<List<CandidateDocument>> GetInvalidDocumentsAsync();
        Task<List<CandidateDocument>> GetValidDocumentsAsync();
        Task SaveChangesAsync();
        Task<List<CandidateDocument>> GetInvalidWithErrorsAsync();
        Task<List<CandidateDocument>> GetErrorsByCentreAsync(string centre);
    }
}

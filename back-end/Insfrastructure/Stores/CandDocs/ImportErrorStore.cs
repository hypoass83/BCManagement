using Domain.Entities.CandDocs;
using Domain.InterfacesStores.CandDocs;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Insfrastructure.Stores.CandDocs
{
    public class ImportErrorStore : IImportErrorService
    {
        private readonly FsContext _context;

        public ImportErrorStore(FsContext context)
        {
            _context = context;
        }

        public async Task AddErrorsAsync(IEnumerable<ImportError> errors)
        {
            await _context.ImportErrors.AddRangeAsync(errors);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<ImportError>> GetAllAsync()
        {
            return await _context.ImportErrors.ToListAsync();
        }
        public async Task<List<ImportError>> GetErrorsForDocument(int candidateDocumentId)
        {
            return await _context.ImportErrors
                .Where(x => x.CandidateDocumentId == candidateDocumentId)
                .ToListAsync();
        }

        public async Task ClearErrorsForDocument(int candidateDocumentId)
        {
            var items = await _context.ImportErrors
                .Where(x => x.CandidateDocumentId == candidateDocumentId)
                .ToListAsync();

            if (items.Any())
            {
                _context.ImportErrors.RemoveRange(items);
                await _context.SaveChangesAsync();
            }
        }
    }

}

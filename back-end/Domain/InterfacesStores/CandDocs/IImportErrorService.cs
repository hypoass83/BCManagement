using Domain.Entities.CandDocs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.InterfacesStores.CandDocs
{
    public interface IImportErrorService
    {
        Task AddErrorsAsync(IEnumerable<ImportError> errors);
        Task<IEnumerable<ImportError>> GetAllAsync();
    }
}

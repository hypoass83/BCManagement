using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities.CandDocs;

namespace Domain.InterfacesStores.CandDocs
{
    public interface IAuditRepository
    {
        Task AddAsync(DocumentAccessAudit audit, CancellationToken ct = default);

        Task<int> CountByDocumentAsync(int documentId, CancellationToken ct = default);

        Task<IReadOnlyList<DocumentAccessAudit>> GetByDocumentAsync(
            int documentId,
            CancellationToken ct = default
        );
    }
}

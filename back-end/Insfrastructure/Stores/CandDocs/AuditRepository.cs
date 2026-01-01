using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities.CandDocs;
using Domain.InterfacesStores.CandDocs;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Stores.CandDocs
{
    public class AuditRepository : IAuditRepository
    {
        private readonly FsContext _db;

        public AuditRepository(FsContext db)
        {
            _db = db;
        }

        public async Task AddAsync(DocumentAccessAudit audit, CancellationToken ct = default)
        {
            _db.DocumentAccessAudits.Add(audit);
            await _db.SaveChangesAsync(ct);
        }

        public async Task<int> CountByDocumentAsync(int documentId, CancellationToken ct = default)
        {
            return await _db.DocumentAccessAudits
                .Where(x => x.DocumentId == documentId)
                .CountAsync(ct);
        }

        public async Task<IReadOnlyList<DocumentAccessAudit>> GetByDocumentAsync(int documentId, CancellationToken ct = default)
        {
            return await _db.DocumentAccessAudits
                .Where(x => x.DocumentId == documentId)
                .OrderByDescending(x => x.AccessedAt)
                .ToListAsync(ct);
        }
    }
}

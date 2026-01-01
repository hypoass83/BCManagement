using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities.CandDocs;
using Domain.InterfacesStores.CandDocs;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Application.Features.CandDocs.Queries
{
    public class GetCandidateDocumentFileHandler   : IRequestHandler<GetCandidateDocumentFileQuery, FileStreamResult?>
    {
        private readonly ICandidateRepository _repository;
        private readonly IAuditRepository _auditRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public GetCandidateDocumentFileHandler(ICandidateRepository repository,
        IAuditRepository auditRepository,
        IHttpContextAccessor httpContextAccessor)
        {
            _repository = repository;
            _auditRepository = auditRepository;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<FileStreamResult?> Handle(GetCandidateDocumentFileQuery request,CancellationToken cancellationToken)
        {
            var doc = await _repository.GetByIdAsync(request.DocumentId);
            if (doc == null || !System.IO.File.Exists(doc.FilePath))
                return null;

            // 🔐 USER
            /*var httpContext = _httpContextAccessor.HttpContext!;
            var userId = int.Parse(httpContext.User.FindFirst("sub")!.Value);*/

            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null)
                throw new InvalidOperationException("No HttpContext available");

            var userIdClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                throw new UnauthorizedAccessException("User not authenticated");

            var userId = int.Parse(userIdClaim.Value);


            // 🌐 IP ADDRESS
            var ipAddress =
                httpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";

            // 🖥️ USER AGENT
            var userAgent =
                httpContext.Request.Headers["User-Agent"].ToString();

            // 🧾 AUDIT LOG
            var audit = new DocumentAccessAudit
            {
                DocumentId = doc.Id,
                UserId = userId,
                AccessedAt = DateTime.UtcNow,
                IpAddress = ipAddress,
                UserAgent = userAgent,
                Action = "View"
            };

            await _auditRepository.AddAsync(audit);

            // 📄 FILE STREAM
            var stream = System.IO.File.OpenRead(doc.FilePath);
            return new FileStreamResult(stream, "application/pdf");
        }
    }
}

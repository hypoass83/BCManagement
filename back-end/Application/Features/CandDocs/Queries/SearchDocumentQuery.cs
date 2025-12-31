using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Common.Models;
using Domain.DTO.CandDocs;
using MediatR;

namespace Application.Features.CandDocs.Queries
{
    
    public class SearchDocumentQuery  : IRequest<PagedResult<CandidateDocumentDto>>
    {
        // 🔴 Champ principal (déjà validé via Request + FluentValidation)
        public string CandidateName { get; set; } = string.Empty;

        // 🟢 Filtres optionnels
        public string? CandidateNumber { get; set; }
        public string? CenterNumber { get; set; }
        public string? ExamCode { get; set; }
        public int? Session { get; set; }

        // Pagination
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 50;
    }

}

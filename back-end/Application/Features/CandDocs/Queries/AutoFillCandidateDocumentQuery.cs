using Domain.DTO.CandDocs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.CandDocs.Queries
{
    public record AutoFillCandidateDocumentQuery(int DocumentId) : IRequest<CandidateAutoFillDto>;
}

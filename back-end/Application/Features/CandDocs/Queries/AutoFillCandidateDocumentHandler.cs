using Domain.DTO.CandDocs;
using Domain.InterfacesServices.CandDocs;
using Domain.InterfacesStores.CandDocs;
using Infrastructure.Services.CandDocs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Application.Features.CandDocs.Queries
{
    public class AutoFillCandidateDocumentHandler
    : IRequestHandler<AutoFillCandidateDocumentQuery, CandidateAutoFillDto?>
    {
        private readonly ICandidateRepository _repo;
        private readonly IOcrService _ocr;
        private readonly ICandidateParser _parser;

        public AutoFillCandidateDocumentHandler(
            ICandidateRepository repo,
            IOcrService ocr,
            ICandidateParser parser)
        {
            _repo = repo;
            _ocr = ocr;
            _parser = parser;
        }

        public async Task<CandidateAutoFillDto?> Handle(AutoFillCandidateDocumentQuery request, CancellationToken ct)
        {
            var doc = await _repo.GetByIdAsync(request.DocumentId);
            if (doc == null)
                return null;

            string? ocrText = doc.OcrText;

            // 1️⃣ Utiliser l'OCR déjà stocké
            if (!string.IsNullOrWhiteSpace(ocrText))
            {
                var result = _parser.ParseAutoFill(ocrText);

                // Si résultat fiable → STOP
                //if (!result.IsConfidenceLow)
                    return result;
            }
            else
            {
                return null;
                
            }
                
        }

        

    }

}

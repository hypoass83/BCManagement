using Domain.DTO.CandDocs;
using Domain.InterfacesServices.CandDocs;
using Domain.InterfacesStores.CandDocs;
using Infrastructure.Services.CandDocs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.CandDocs.Queries
{
    public class AutoFillCandidateDocumentHandler
    : IRequestHandler<AutoFillCandidateDocumentQuery, CandidateAutoFillDto?>
    {
        private readonly ICandidateRepository _repo;
        private readonly IOcrService _ocr;
        private readonly ICandidateParser _parser;
        private readonly IPdfRenderService _pdfRenderService;

        public AutoFillCandidateDocumentHandler(
            ICandidateRepository repo,
            IOcrService ocr,
            ICandidateParser parser,
            IPdfRenderService pdfRenderService)
        {
            _repo = repo;
            _ocr = ocr;
            _parser = parser;
            _pdfRenderService = pdfRenderService;
        }

        public async Task<CandidateAutoFillDto?> Handle(AutoFillCandidateDocumentQuery request, CancellationToken ct) {
            var doc = await _repo.GetByIdAsync(request.DocumentId);
            if (doc == null) return null;

            // 1️⃣ Charger le PDF
            var pdfBytes = await File.ReadAllBytesAsync(doc.FilePath, ct);

            // 2️⃣ OCR ciblé (page 1 + zone CIN)
            var cinZoneImage = _pdfRenderService.ConvertFirstPageCinZoneToImage(pdfBytes, dpi: 300);

            var ocrText = await _ocr.ExtractTextAsync(cinZoneImage);

            // 3️⃣ Parsing métier
            return _parser.ParseAutoFill(ocrText);
        }

    }

}

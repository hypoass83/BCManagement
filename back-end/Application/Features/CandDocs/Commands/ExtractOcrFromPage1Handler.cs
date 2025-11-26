using Domain.InterfacesServices.CandDocs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.CandDocs.Commands
{
    public class ExtractOcrFromPage1Handler
    {
        private readonly ITesseractService _ocr;

        public ExtractOcrFromPage1Handler(ITesseractService ocr)
        {
            _ocr = ocr;
        }

        public async Task<string> Handle(ExtractOcrFromPage1 request, CancellationToken ct = default)
        {
            if (request.PdfFile == null || request.PdfFile.Length == 0)
                return string.Empty;
            var text = await _ocr.ExtractTextFromPdfAsync(request.PdfFile, request.PageNumber);
            return text ?? string.Empty;
        }
    }
}

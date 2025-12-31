using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.InterfacesServices.CandDocs
{
    public interface IOcrService
    {
        Task<string> ExtractTextAsync(byte[] imageBytes);
        string ExtractTextFromImage(byte[] imageBytes);
        //  POUR AUTOFILL
        Task<string> ExtractTextFromPdfAsync(
            string pdfPath,
            int page,
            bool highAccuracy,
            CancellationToken ct = default
        );
    }
}

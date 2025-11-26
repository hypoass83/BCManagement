using Domain.InterfacesServices.CandDocs;
using System.Text;
using UglyToad.PdfPig;

namespace Insfrastructure.Services.CandDocs
{
    public class PdfPigTextExtractor : IPdfTextExtractor
    {
        public string ExtractText(byte[] pdfBytes)
        {
            using var stream = new MemoryStream(pdfBytes);
            using var doc = PdfDocument.Open(stream);

            var page = doc.GetPage(1);  // Only Page 1
            //return page.Text ?? string.Empty;
            var sb = new StringBuilder();

            // Order text by Y descending (top→bottom), X ascending (left→right)
            var words = page.GetWords()
                .OrderByDescending(w => w.BoundingBox.Top)
                .ThenBy(w => w.BoundingBox.Left);

            foreach (var word in words)
            {
                sb.Append(word.Text + " ");
            }

            return sb.ToString().Trim();
        }
    }
}

using iText.Kernel.Pdf;
using Domain.InterfacesServices.CandDocs;

namespace BCDocumentManagement.Infrastructure.Services.CandDocs
{
    public class PdfSplitService : IPdfSplitService
    {
        public async Task<List<byte[]>> SplitPdfByPageAsync(byte[] pdfBytes)
        {
            var result = new List<byte[]>();

            using (var inputStream = new MemoryStream(pdfBytes))
            using (var reader = new PdfReader(inputStream))
            using (var pdfDoc = new PdfDocument(reader))
            {
                int totalPages = pdfDoc.GetNumberOfPages();

                for (int i = 1; i <= totalPages; i++)
                {
                    using var outputStream = new MemoryStream();
                    using var writer = new PdfWriter(outputStream);
                    using var singlePagePdf = new PdfDocument(writer);

                    // Copy page i into a new PDF
                    pdfDoc.CopyPagesTo(i, i, singlePagePdf);

                    singlePagePdf.Close();
                    result.Add(outputStream.ToArray());
                }
            }

            return result;
        }
    }
}

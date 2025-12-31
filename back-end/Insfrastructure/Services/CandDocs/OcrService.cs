using Domain.InterfacesServices.CandDocs;
using Tesseract;

namespace Infrastructure.Services.CandDocs
{
    public class OcrService : IOcrService
    {
        private readonly string _tessDataPath;
        private readonly IPdfRenderService _pdfRenderService;
        public OcrService(IPdfRenderService pdfRenderService)
        {
            _tessDataPath = Path.Combine(AppContext.BaseDirectory, "tessdata");
            _pdfRenderService = pdfRenderService;
        }

        public async Task<string> ExtractTextAsync(byte[] imageBytes)
        {
            using var img = Pix.LoadFromMemory(imageBytes);
            using var ocr = new TesseractEngine(_tessDataPath, "eng+fra", EngineMode.Default);

            using var page = ocr.Process(img);
            return page.GetText();
        }
        public string ExtractTextFromImage(byte[] imageBytes)
        {
            using var engine = new TesseractEngine(_tessDataPath, "eng", EngineMode.Default);

            using var img = Pix.LoadFromMemory(imageBytes);
            using var page = engine.Process(img);

            return page.GetText();
        }

        public async Task<string> ExtractTextFromPdfAsync(string pdfPath,int page, bool highAccuracy, CancellationToken ct = default)
        {
            // 1️⃣ PDF → image (page ciblée)
            byte[] imageBytes = _pdfRenderService.ConvertPageToImage(
                pdfPath,
                page,
                dpi: highAccuracy ? 300 : 150
            );

            // 2️⃣ OCR (réutilise ton existant)
            return await ExtractTextAsync(imageBytes);
        }

    }
}

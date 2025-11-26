using Domain.InterfacesServices.CandDocs;
using Tesseract;

namespace BCDocumentManagement.Infrastructure.Services.CandDocs
{
    public class OcrService : IOcrService
    {
        private readonly string _tessDataPath;

        public OcrService()
        {
            _tessDataPath = Path.Combine(AppContext.BaseDirectory, "tessdata");
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
    }
}

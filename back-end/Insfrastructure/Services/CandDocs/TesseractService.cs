using Domain.InterfacesServices.CandDocs;
using ImageMagick;
using SkiaSharp;
using Tesseract;

namespace Insfrastructure.Services.CandDocs
{
    public class TesseractService : ITesseractService, IDisposable
    {
        private readonly string _tessdataPath;
        private readonly EngineMode _engineMode = EngineMode.Default;
        public TesseractService(string tessdataPath)
        {
            _tessdataPath = tessdataPath ?? throw new ArgumentNullException(nameof(tessdataPath));
        }

        public string ExtractTextFromImage(byte[] imageBytes)
        {
            using var img = Pix.LoadFromMemory(imageBytes);

            using var engine = new TesseractEngine(
                _tessdataPath,
                "eng",
                EngineMode.Default);

            using var page = engine.Process(img);

            return page.GetText();
        }

        public async Task<string> ExtractTextFromPdfAsync(byte[] pdfBytes, int pageNumber = 1)
        {
            try
            {
                if (pdfBytes == null) throw new ArgumentNullException(nameof(pdfBytes));

                // Render one page of the PDF to an image using Magick.NET
                var settings = new MagickReadSettings
                {
                    Density = new Density(200), // 300 DPI is usually good for OCR (can lower to 200 for speed)
                    FrameIndex = (uint?)(pageNumber - 1),
                    FrameCount = 1
                };

                using var images = new MagickImageCollection();
                using var ms = new MemoryStream(pdfBytes);
                images.Read(ms, settings);

                if (images.Count == 0) return string.Empty;

                using var image = (MagickImage)images[0];

                // Preprocessing: grayscale + normalize/contrast
                image.ColorType = ColorType.Grayscale;
                image.Normalize();
                // optionally: image.Despeckle(), image.UnsharpMask(), etc.

                using var pngStream = new MemoryStream();
                await image.WriteAsync(pngStream, MagickFormat.Png);
                var pngBytes = pngStream.ToArray();

                return ExtractWithTesseract(pngBytes);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public Task<string> ExtractTextFromImageAsync(byte[] imageBytes)
        {
            if (imageBytes == null) throw new ArgumentNullException(nameof(imageBytes));
            var text = ExtractWithTesseract(imageBytes);
            return Task.FromResult(text);
        }

        private string ExtractWithTesseract(byte[] imageBytes)
        {
            // Create engine using tessdata path. Languages: adjust ("eng+fra") as needed.
            using var engine = new TesseractEngine(_tessdataPath, "eng+fra", _engineMode);
            using var img = Pix.LoadFromMemory(imageBytes);
            using var page = engine.Process(img);
            var text = page.GetText();
            return text ?? string.Empty;
        }

        public void Dispose()
        {
            // nothing in particular to dispose here (we create TesseractEngine per-call)
        }
    }
}

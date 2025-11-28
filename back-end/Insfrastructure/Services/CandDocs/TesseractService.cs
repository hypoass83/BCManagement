// TesseractService.cs
// Full OCR service: PDF page -> render -> preprocess -> Tesseract OCR -> cleaned text
// Requires NuGet packages (recommended):
// - Tesseract (>= 5.0)
// - SkiaSharp (2.88.7) and SkiaSharp.NativeAssets.Win32 (2.88.7)
// - MuPDFCore (if using MuPDF rendering) OR Docnet.Core (fallback)
// - (optional) Docnet.Core
//
// Important: adapt MuPDF / Docnet method calls to match the exact package versions you installed.

using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Runtime.Versioning;

using SkiaSharp;
using Tesseract;
using Domain.InterfacesServices.CandDocs;
using MuPDFCore;

#if USE_MUPDF
// If you installed MuPDFCore, enable this and adjust names to your version
using MuPDFCore;
#endif

#if USE_DOCNET
using Docnet.Core;
using Docnet.Core.Models;
#endif

namespace Insfrastructure.Services.CandDocs
{
    [SupportedOSPlatform("windows")] // since we rely on Tesseract native libs and SkiaSharp native assets on Windows
    public class TesseractService : ITesseractService, IDisposable
    {
        private readonly TesseractEngine _engine;
        private readonly string _tessdataPath;

        public TesseractService(string tessdataPath, string language = "eng")
        {
            _tessdataPath = tessdataPath ?? throw new ArgumentNullException(nameof(tessdataPath));
            // Initialize Tesseract engine (LSTM only recommended)
            _engine = new TesseractEngine(_tessdataPath, language, EngineMode.LstmOnly);
            // Tuning variables (adjust to your documents)
            _engine.SetVariable("tessedit_char_whitelist", "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-/. ");
            _engine.SetVariable("load_system_dawg", "0");
            _engine.SetVariable("load_freq_dawg", "0");
        }

        /// <summary>
        /// Main entry: extract text from a PDF page (indexed from 1).
        /// Tries MuPDF rendering first (if available), otherwise falls back to Docnet.
        /// </summary>
        public async Task<string> ExtractTextFromPdfAsync(byte[] pdfBytes, int pageNumber = 1)
        {
            if (pdfBytes == null) throw new ArgumentNullException(nameof(pdfBytes));
            if (pageNumber < 1) throw new ArgumentOutOfRangeException(nameof(pageNumber));

            byte[] pngBytes = null;

            // 1) Try MuPDF rendering (preferred if installed and recent)
#if USE_MUPDF
            try
            {
                // MuPDFCore API differs between versions — adjust if needed.
                // Example for MuPdfDocument.Open(...) or MuDocument.Open(pdfBytes)
                using var doc = MuPdfDocument.Open(pdfBytes); // <-- adjust to your MuPDF package API
                int index = pageNumber - 1;
                if (index < 0 || index >= doc.PageCount) return string.Empty;

                using var page = doc.LoadPage(index);
                using var pix = page.RenderBitmap(200, 200); // adjust method to your MuPDF version
                pngBytes = pix.ToPNG();
            }
            catch (Exception muEx)
            {
                // swallow and fallback
                pngBytes = null;
            }
#endif

            // 2) Fallback: Docnet.Core (pure .NET, reliable on .NET 8)
#if USE_DOCNET
            if (pngBytes == null)
            {
                try
                {
                    // Docnet expects byte[] input
                    using var docReader = DocLib.Instance.GetDocReader(pdfBytes, new PageDimensions());
                    int pageCount = docReader.GetPageCount();
                    int index = pageNumber - 1;
                    if (index < 0 || index >= pageCount) return string.Empty;

                    using var pageReader = docReader.GetPageReader(index);
                    var rawBytes = pageReader.GetImage(); // BGR or BGRA bytes
                    int width = pageReader.GetPageWidth();
                    int height = pageReader.GetPageHeight();

                    // convert raw bytes to PNG using safe stride-aware copy
                    pngBytes = ConvertRawBgrToPng(rawBytes, width, height);
                }
                catch (Exception de)
                {
                    // if Docnet fails, try other approach or bubble up
                    throw new Exception("PDF rasterization failed: " + de.Message, de);
                }
            }
#endif

            // 3) If still null, try a final attempt with System.Drawing+Pdfium/other (not included here)

            if (pngBytes == null)
                throw new Exception("No PDF renderer available. Install MuPDFCore or Docnet.Core or enable corresponding compilation symbol.");

            // 4) Preprocess image for OCR (SkiaSharp)
            var preprocessed = PreprocessForOCR(pngBytes);

            // 5) OCR via Tesseract
            var text = ExtractWithTesseract(preprocessed);

            // 6) Post-process / clean
            return CleanOcrText(text);
        }

        /// <summary>
        /// Directly OCR from an image (png/jpg bytes)
        /// </summary>
        public string ExtractTextFromImage(byte[] imageBytes)
        {
            if (imageBytes == null) throw new ArgumentNullException(nameof(imageBytes));
            var pre = PreprocessForOCR(imageBytes);
            var raw = ExtractWithTesseract(pre);
            return CleanOcrText(raw);
        }

        // ---------------------------
        // OCR helper: call Tesseract
        // ---------------------------
        private string ExtractWithTesseract(byte[] pngBytes)
        {
            if (pngBytes == null || pngBytes.Length == 0) return string.Empty;

            // Use Pix.LoadFromMemory (Tesseract library) to create pix
            using var pix = Pix.LoadFromMemory(pngBytes);
            using var page = _engine.Process(pix, PageSegMode.SingleBlock);
            var text = page.GetText();
            return text ?? string.Empty;
        }

        // ---------------------------
        // Preprocessing using SkiaSharp
        // - converts to grayscale, contrast, blur, sharpen, Otsu binarization
        // ---------------------------
        private byte[] PreprocessForOCR(byte[] pngBytes)
        {
            if (pngBytes == null || pngBytes.Length == 0) return pngBytes;

            using var src = SKBitmap.Decode(pngBytes);
            if (src == null) return pngBytes;

            int w = src.Width;
            int h = src.Height;

            // scale large images down to a max dimension to avoid memory hogging but keep resolution for OCR
            const int maxDim = 2500;
            if (w > maxDim || h > maxDim)
            {
                float scale = Math.Min((float)maxDim / w, (float)maxDim / h);
                int nw = (int)(w * scale);
                int nh = (int)(h * scale);
                var scaled = src.Resize(new SKImageInfo(nw, nh), SKFilterQuality.High);
                if (scaled != null)
                {
                    src.Dispose();
                    // assign scaled to src variable semantics (can't reassign using)
                }
            }

            // Create a grayscale surface
            using var surface = SKSurface.Create(new SKImageInfo(w, h, SKColorType.Gray8, SKAlphaType.Opaque));
            var canvas = surface.Canvas;
            canvas.Clear(SKColors.White);

            // 1) Draw the original into grayscale using color matrix
            var grayMatrix = new float[]
            {
                0.299f, 0.587f, 0.114f, 0, 0,
                0.299f, 0.587f, 0.114f, 0, 0,
                0.299f, 0.587f, 0.114f, 0, 0,
                0,      0,      0,      1, 0
            };

            var paint = new SKPaint
            {
                ColorFilter = SKColorFilter.CreateColorMatrix(grayMatrix)
            };
            canvas.DrawBitmap(src, 0, 0, paint);

            // 2) Increase contrast slightly (HighContrast available in 2.88.x)
            try
            {
                var hcConfig = new SKHighContrastConfig(
                    grayscale: true,
                    invertStyle: SKHighContrastConfigInvertStyle.NoInvert,
                    contrast: 0.45f);
                var contrastFilter = SKColorFilter.CreateHighContrast(hcConfig);

                paint = new SKPaint { ColorFilter = contrastFilter };
                using (var img2 = surface.Snapshot())
                using (var bmp2 = SKBitmap.FromImage(img2))
                {
                    canvas.DrawBitmap(bmp2, 0, 0, paint);
                }
            }
            catch
            {
                // If HighContrast API not available in your Skia version, skip this step
            }

            // 3) Small blur to remove speckle
            paint = new SKPaint { ImageFilter = SKImageFilter.CreateBlur(0.7f, 0.7f) };
            using (var img2 = surface.Snapshot())
            using (var bmp2 = SKBitmap.FromImage(img2))
            {
                canvas.DrawBitmap(bmp2, 0, 0, paint);
            }

            // 4) Sharpen (via convolution kernel)
            var sharpenKernel = new float[]
            {
                 0, -1,  0,
                -1,  5, -1,
                 0, -1,  0
            };
            var sharpenFilter = SKImageFilter.CreateMatrixConvolution(
                new SKSizeI(3, 3),
                sharpenKernel,
                1f, 0f,
                new SKPointI(1, 1),
                SKMatrixConvolutionTileMode.Clamp,
                false
            );
            paint = new SKPaint { ImageFilter = sharpenFilter };

            using (var img2 = surface.Snapshot())
            using (var bmp2 = SKBitmap.FromImage(img2))
            {
                canvas.DrawBitmap(bmp2, 0, 0, paint);
            }

            // 5) Binarize using Otsu threshold
            using var snapshot = surface.Snapshot();
            using var bitmapGray = SKBitmap.FromImage(snapshot);
            var outBitmap = OtsuBinarize(bitmapGray);

            // Return PNG bytes of binarized image
            using var img = SKImage.FromBitmap(outBitmap);
            using var encoded = img.Encode(SKEncodedImageFormat.Png, 100);
            return encoded.ToArray();
        }

        // Otsu binarization: returns an 8-bit grayscale SKBitmap
        private SKBitmap OtsuBinarize(SKBitmap src)
        {
            int w = src.Width, h = src.Height;
            var outBmp = new SKBitmap(w, h, SKColorType.Gray8, SKAlphaType.Opaque);

            // Build histogram
            var histogram = new int[256];
            for (int y = 0; y < h; y++)
            {
                for (int x = 0; x < w; x++)
                {
                    var c = src.GetPixel(x, y);
                    byte v = c.Red; // gray image so R==G==B
                    histogram[v]++;
                }
            }

            int total = w * h;
            double sum = 0;
            for (int i = 0; i < 256; i++) sum += i * histogram[i];

            double sumB = 0;
            int wB = 0;
            double max = 0.0;
            int threshold = 0;

            for (int i = 0; i < 256; i++)
            {
                wB += histogram[i];
                if (wB == 0) continue;
                int wF = total - wB;
                if (wF == 0) break;

                sumB += (double)(i * histogram[i]);
                double mB = sumB / wB;
                double mF = (sum - sumB) / wF;
                double between = (double)wB * wF * (mB - mF) * (mB - mF);
                if (between > max)
                {
                    max = between;
                    threshold = i;
                }
            }

            // Apply threshold
            for (int y = 0; y < h; y++)
            {
                for (int x = 0; x < w; x++)
                {
                    byte v = src.GetPixel(x, y).Red;
                    byte b = (byte)(v < threshold ? 0 : 255);
                    outBmp.SetPixel(x, y, new SKColor(b, b, b));
                }
            }

            return outBmp;
        }

        // ---------------------------
        // Raw BGR/BGRA -> PNG helper for Docnet bytes
        // ---------------------------
        private byte[] ConvertRawBgrToPng(byte[] rawBytes, int width, int height)
        {
            if (rawBytes == null) throw new ArgumentNullException(nameof(rawBytes));
            long pixels = (long)width * height;
            if (pixels <= 0) throw new ArgumentException("Invalid width/height.");

            int bppGuess = (int)(rawBytes.Length / pixels);
            SKBitmap bmp;
            if (bppGuess >= 4)
            {
                // BGRA -> use SKColorType.Bgra8888
                bmp = new SKBitmap(new SKImageInfo(width, height, SKColorType.Bgra8888, SKAlphaType.Unpremul));
                // Copy row by row
                int srcRow = width * 4;
                for (int y = 0; y < height; y++)
                {
                    var span = rawBytes.AsSpan(y * srcRow, srcRow);
                    // SKBitmap uses RGBA ordering; need to swap B and R per pixel
                    for (int x = 0; x < width; x++)
                    {
                        int off = x * 4;
                        byte b = span[off + 0];
                        byte g = span[off + 1];
                        byte r = span[off + 2];
                        byte a = span[off + 3];
                        bmp.SetPixel(x, y, new SKColor(r, g, b, a));
                    }
                }
            }
            else
            {
                // BGR -> create RGB888 but Skia doesn't have RGB24; use RGBA with alpha=255
                bmp = new SKBitmap(new SKImageInfo(width, height, SKColorType.Rgba8888, SKAlphaType.Opaque));
                int srcRow = width * 3;
                for (int y = 0; y < height; y++)
                {
                    var span = rawBytes.AsSpan(y * srcRow, srcRow);
                    for (int x = 0; x < width; x++)
                    {
                        int off = x * 3;
                        byte b = span[off + 0];
                        byte g = span[off + 1];
                        byte r = span[off + 2];
                        bmp.SetPixel(x, y, new SKColor(r, g, b, 255));
                    }
                }
            }

            using var img = SKImage.FromBitmap(bmp);
            using var enc = img.Encode(SKEncodedImageFormat.Png, 100);
            return enc.ToArray();
        }

        // ---------------------------
        // Cleanup OCR text: common replacements and trimming
        // ---------------------------
        private string CleanOcrText(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return string.Empty;

            // Basic normalizations (customize to your needs)
            var s = text.Trim();

            // Replace common OCR mistakes that cause parsing problems
            s = s.Replace("O", "0"); // be careful: this may affect names, use carefully or do field-specific cleaning
            s = s.Replace("I", "1"); // same caution

            // Remove repeated whitespace and fix newlines
            s = System.Text.RegularExpressions.Regex.Replace(s, @"[ \t]{2,}", " ");
            s = System.Text.RegularExpressions.Regex.Replace(s, @"\r\n|\r|\n", "\n");

            return s;
        }

        // ---------------------------
        // Convert a System.Drawing.Bitmap to PNG (not used by default)
        // ---------------------------
        private byte[] BitmapToPngBytes(System.Drawing.Bitmap bmp)
        {
            using var ms = new MemoryStream();
            bmp.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
            return ms.ToArray();
        }

        public void Dispose()
        {
            _engine?.Dispose();
        }

        string ITesseractService.ExtractTextFromImage(byte[] imageBytes)
        {
            if (imageBytes == null || imageBytes.Length == 0)
                return string.Empty;

            // Preprocess for OCR
            var processed = PreprocessForOCR(imageBytes);

            // Run OCR
            var text = ExtractWithTesseract(processed);

            return CleanOcrText(text);
        }

        public async Task<string> ExtractTextFromImageAsync(byte[] imageBytes)
        {
            if (imageBytes == null || imageBytes.Length == 0)
                return string.Empty;

            return await Task.Run(() =>
            {
                var processed = PreprocessForOCR(imageBytes);
                var text = ExtractWithTesseract(processed);
                return CleanOcrText(text);
            });
        }



    }
}

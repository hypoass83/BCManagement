using Domain.InterfacesServices.CandDocs;
using PdfiumViewer;
using System.Drawing;
using System.Drawing.Imaging;

namespace Infrastructure.Services.CandDocs
{

    public class PdfRenderService : IPdfRenderService
    {
        // ✅ EXISTANT — NE PAS MODIFIER
        public byte[] ConvertPageToImage(string pdfPath, int page, int dpi = 300)
        {
            using var document = PdfDocument.Load(pdfPath);
            return Render(document, page, dpi);
        }

        public byte[] ConvertPageToImage(byte[] pdfBytes, int page, int dpi = 300)
        {
            using var ms = new MemoryStream(pdfBytes, writable: false);
            using var document = PdfDocument.Load(ms);
            return Render(document, page, dpi);
        }

        // =====================================================
        // 🔥 NOUVEAU : OCR ciblé page 1 (zone CIN / Name / Centre)
        // =====================================================
        public byte[] ConvertFirstPageCinZoneToImage(byte[] pdfBytes, int dpi = 300)
        {
            using var ms = new MemoryStream(pdfBytes, writable: false);
            using var document = PdfDocument.Load(ms);

            using var renderedImage = document.Render(
                page: 0,
                dpiX: dpi,
                dpiY: dpi,
                flags: PdfRenderFlags.Annotations
            );

            using var fullPage = new Bitmap(renderedImage);
            using var cinZone = CropCinZone(fullPage);

            using var outMs = new MemoryStream();
            cinZone.Save(outMs, ImageFormat.Png);

            return outMs.ToArray();
        }


        // =====================================================
        // 🔧 MÉTHODES PRIVÉES
        // =====================================================
        private byte[] Render(PdfDocument document, int page, int dpi)
        {
            if (page < 1 || page > document.PageCount)
                throw new ArgumentOutOfRangeException(nameof(page));

            using var image = document.Render(
                page - 1,
                dpi,
                dpi,
                PdfRenderFlags.Annotations
            );

            using var ms = new MemoryStream();
            image.Save(ms, ImageFormat.Png);

            return ms.ToArray();
        }

        // 🔥 Découpage intelligent de la zone CIN
        private static Bitmap CropCinZone(Bitmap source)
        {
            int w = source.Width;
            int h = source.Height;

            // ✅ Zone STRICTE : CIN / Name / Centre uniquement
            var rect = new Rectangle(
                x: (int)(w * 0.05),
                y: (int)(h * 0.20),
                width: (int)(w * 0.90),
                height: (int)(h * 0.18)
            );

            return source.Clone(rect, source.PixelFormat);
        }
    }
}

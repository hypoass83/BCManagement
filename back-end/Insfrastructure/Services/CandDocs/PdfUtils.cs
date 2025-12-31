
using iText.Kernel.Pdf;


namespace Infrastructure.Services.CandDocs
{
    public static class PdfUtils
    {


        public static async Task<List<byte[]>> SplitPdfByPageAsync(byte[] pdfBytes)
        {
            var pages = new List<byte[]>();

            try
            {
                using var ms = new MemoryStream(pdfBytes, writable: false);
                using var reader = new PdfReader(ms);
                using var src = new PdfDocument(reader);

                int total = src.GetNumberOfPages();

                for (int i = 1; i <= total; i++)
                {
                    using var outMs = new MemoryStream();
                    using var writer = new PdfWriter(outMs);
                    using var dest = new PdfDocument(writer);

                    src.CopyPagesTo(i, i, dest);
                    dest.Close();

                    pages.Add(outMs.ToArray());
                }

                return pages;
            }
            catch (Exception)
            {
                // 🔁 Fallback: tentative de réparation
                byte[] repaired = RewritePdf(pdfBytes);

                using var ms = new MemoryStream(repaired, writable: false);
                using var reader = new PdfReader(ms);
                using var src = new PdfDocument(reader);

                int total = src.GetNumberOfPages();

                for (int i = 1; i <= total; i++)
                {
                    using var outMs = new MemoryStream();
                    using var writer = new PdfWriter(outMs);
                    using var dest = new PdfDocument(writer);

                    src.CopyPagesTo(i, i, dest);
                    dest.Close();

                    pages.Add(outMs.ToArray());
                }

                return pages;
            }
        }


        public static async Task<byte[]> MergeTwoPagesAsync(byte[] p1, byte[] p2)
        {
            if (p1 == null || p1.Length == 0)
                throw new ArgumentException("Page 1 is empty or null");

            using var outMs = new MemoryStream();
            using var writer = new PdfWriter(outMs);
            using var dest = new PdfDocument(writer);

            // ---------- Page 1 ----------
            using (var ms1 = new MemoryStream(p1))
            using (var reader1 = new PdfReader(ms1))
            using (var src1 = new PdfDocument(reader1))
            {
                src1.CopyPagesTo(1, src1.GetNumberOfPages(), dest);
            }

            // ---------- Page 2 (optional) ----------
            if (p2 != null && p2.Length > 0)
            {
                using (var ms2 = new MemoryStream(p2))
                using (var reader2 = new PdfReader(ms2))
                using (var src2 = new PdfDocument(reader2))
                {
                    src2.CopyPagesTo(1, src2.GetNumberOfPages(), dest);
                }
            }

            dest.Close(); // force write

            return outMs.ToArray();
        }

        public static PdfDocument OpenLenient(byte[] pdfBytes)
        {
            var ms = new MemoryStream(pdfBytes, writable: false);

            var reader = new PdfReader(ms);

            return new PdfDocument(reader);
        }

        public static byte[] RewritePdf(byte[] input)
        {
            using var inputStream = new MemoryStream(input, writable: false);
            using var reader = new PdfReader(inputStream);

            using var outputStream = new MemoryStream();
            using var writer = new PdfWriter(outputStream);

            using var pdf = new PdfDocument(reader, writer);
            pdf.Close();

            return outputStream.ToArray();
        }



    }
}

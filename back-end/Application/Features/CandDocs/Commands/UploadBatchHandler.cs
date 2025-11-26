using Application.Features.CandDocs.Commands;
using Application.Service;
using Domain.Entities.CandDocs;
using Domain.InterfacesServices.CandDocs;
using Domain.InterfacesServices.Security;
using Domain.InterfacesStores.CandDocs;
using Insfrastructure.Services.CandDocs;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using UglyToad.PdfPig;
using static iText.StyledXmlParser.Jsoup.Select.Evaluator;

namespace BCDocumentManagement.Application.Features.CandDocs.Commands
{
    public class UploadBatchHandler
    {
        private readonly IPdfSplitService _pdfSplit;
        private readonly ITesseractService _ocr;
        private readonly IFileStore _fileStore;
        private readonly ICandidateRepository _candidateRepo;
        private readonly IPdfTextExtractor _pdfTextExtractor;
        private readonly ICandidateParser _candidateParser;
        private readonly ICurrentUserService _currentUserService;
        public UploadBatchHandler(
            IPdfSplitService pdfSplit,
            ITesseractService ocr,
            IFileStore fileStore,
            ICandidateRepository candidateRepo,
            IPdfTextExtractor pdfTextExtractor,
            ICandidateParser candidateParser, ICurrentUserService currentUserService)
        {
            _pdfSplit = pdfSplit;
            _ocr = ocr;
            _fileStore = fileStore;
            _candidateRepo = candidateRepo;
            _pdfTextExtractor = pdfTextExtractor;
            _candidateParser = candidateParser;
            _currentUserService = currentUserService;
        }

        /// <summary>
        /// Process the PDF batch: split pages, group 2 pages per candidate,
        /// create candidate PDF bytes, OCR page1, save file and persist metadata.
        /// </summary>
        public async Task<UploadBatchResult> HandleAsync(UploadBatchCommand command, CancellationToken ct = default)
        {
            var request = command.Request ?? throw new ArgumentNullException(nameof(command.Request));
            var result = new UploadBatchResult();

            // 1. Split input PDF into single-page PDF bytes (list order preserved)
            var singlePagePdfs = await _pdfSplit.SplitPdfByPageAsync(request.PdfFile);

            // 2. Group pages into pairs (2 pages -> 1 candidate PDF)
            var pairs = new List<(byte[] page1Pdf, byte[] page2Pdf)>();
            for (int i = 0; i < singlePagePdfs.Count; i += 2)
            {
                var page1 = singlePagePdfs[i];
                byte[] page2 = (i + 1 < singlePagePdfs.Count) ? singlePagePdfs[i + 1] : null;
                pairs.Add((page1, page2));
            }

            int candidateIndex = 0;
            foreach (var pair in pairs)
            {
                candidateIndex++;
                try
                {
                    // 3. Build combined candidate PDF (2 pages) in memory
                    // The file name convention can be: {Year}_{ExamCode}_{Center}_{Batch}_{CandidateIndex:D4}.pdf
                    string fileName = $"{request.ExamYear}_{request.ExamCode}_{request.CenterNumber}_{candidateIndex:D4}.pdf";

                    // Create combined PDF bytes (page1 + page2)
                    var combinedPdfBytes = await CreateTwoPagePdfAsync(pair.page1Pdf, pair.page2Pdf);

                    // 4. Save file to storage
                    var savedPath = await _fileStore.SaveFileAsync(combinedPdfBytes, fileName);

                    // 5. OCR: extract text from page1 (we assume IOcrService accepts PDF bytes or image bytes)
                    string ocrText = string.Empty;
                    try
                    {
                        // If your IOcrService expects image bytes, the IOcr implementation should convert page1 PDF->image internally.
                        //ocrText = await _ocr.ExtractTextAsync(pair.page1Pdf);
                        ocrText = await _ocr.ExtractTextFromPdfAsync(pair.page1Pdf, 1);
                    }
                    catch
                    {
                        // swallow or log - OCR may fail for some pages
                        ocrText = string.Empty;
                    }

                    var info = _candidateParser.Parse(ocrText ?? "");

                    var examyear = info.SessionYear ?? request.ExamYear;
                    var centrenumber = info.CentreNumber ?? request.CenterNumber;
                    var candidateNumber = info.CandidateNumber;
                    var candidateName = info.CandidateName;
                    //var rawExtractedText = rawText; // optional for debugging

                    // 7. Persist a CandidateDocument entity
                    var entity = new CandidateDocument
                    {
                        CandidateName = candidateName,
                        CandidateNumber = candidateNumber,
                        Session = examyear,
                        CentreCode = centrenumber,
                        FilePath = savedPath,
                        OcrText = ocrText ?? "",
                        CreatedAt = DateTime.UtcNow,
                        UserId= _currentUserService.GetCurentUserId() ?? 2
                    };

                    await _candidateRepo.AddCandidateDocumentAsync(entity);

                    result.SavedFilePaths.Add(savedPath);
                    }
                catch (Exception ex)
                {
                    // log error - for now add to result's error list (you can use a proper logger)
                    result.Errors.Add($"CandidateIndex {candidateIndex}: {ex.Message}");
                }
            }

            result.TotalCandidates = result.SavedFilePaths.Count;
            return result;
        }

        

        // Helper: build two-page PDF by appending page bytes (implementation uses PdfSharpCore or iText via MemoryStreams)
        private async Task<byte[]> CreateTwoPagePdfAsync(byte[] page1Pdf, byte[] page2Pdf)
        {
            // Use iText7 to merge byte[] single-page PDFs into one PDF
            using var outMs = new MemoryStream();
            using (var pdfWriter = new iText.Kernel.Pdf.PdfWriter(outMs))
            {
                using var dest = new iText.Kernel.Pdf.PdfDocument(pdfWriter);
                // copy page1
                using (var reader1 = new iText.Kernel.Pdf.PdfReader(new MemoryStream(page1Pdf)))
                using (var src1 = new iText.Kernel.Pdf.PdfDocument(reader1))
                {
                    src1.CopyPagesTo(1, src1.GetNumberOfPages(), dest);
                }

                if (page2Pdf != null)
                {
                    using (var reader2 = new iText.Kernel.Pdf.PdfReader(new MemoryStream(page2Pdf)))
                    using (var src2 = new iText.Kernel.Pdf.PdfDocument(reader2))
                    {
                        src2.CopyPagesTo(1, src2.GetNumberOfPages(), dest);
                    }
                }
                dest.Close();
            }

            return outMs.ToArray();
        }

        
    }
}

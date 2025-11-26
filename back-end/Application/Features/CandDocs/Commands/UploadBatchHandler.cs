using Application.Features.CandDocs.Commands;
using Application.Features.CandDocs.Validators;
using Application.Service;
using Domain.DTO.CandDocs;
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
        private readonly IImportErrorService _importErrorService;
        private readonly ICandidateParser _candidateParser;
        private readonly ICurrentUserService _currentUserService;
        public UploadBatchHandler(
            IPdfSplitService pdfSplit,
            ITesseractService ocr,
            IFileStore fileStore,
            ICandidateRepository candidateRepo,
            IImportErrorService importErrorService,
            ICandidateParser candidateParser, ICurrentUserService currentUserService)
        {
            _pdfSplit = pdfSplit;
            _ocr = ocr;
            _fileStore = fileStore;
            _candidateRepo = candidateRepo;
            _importErrorService = importErrorService;
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
                    catch (Exception ocrEx)
                    {
                        // If OCR fails, log an OCRIssue error and continue (no candidate insert)
                        await LogOcrError(ocrEx, savedPath, request, command.UploadedBy, candidateIndex, result);
                        continue; // skip to next candidate
                    }

                    var info = _candidateParser.Parse(ocrText ?? "");

                    // Validate
                    var validator = new DocumentValidator(command.UploadedBy);
                    var validation = validator.Validate(pair.page1Pdf, ocrText ?? "", info, savedPath, request);

                    if (!validation.IsValid)
                    {
                        // Persist validation errors
                        await _importErrorService.AddErrorsAsync(validation.Errors);
                        // Optionally add messages to result for API response
                        foreach (var e in validation.Errors)
                            result.Errors.Add($"CandidateIndex {candidateIndex}: {e.FieldName} - {e.ErrorMessage}");

                        // do NOT persist CandidateDocument when there are validation errors
                        continue;
                    }

                    /*var examyear = info.SessionYear ?? request.ExamYear;
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
                    };*/

                    // If valid -> persist CandidateDocument
                    var entity = new CandidateDocument
                    {
                        CandidateName = info.CandidateName,
                        CandidateNumber = info.CandidateNumber,
                        Session = info.SessionYear ?? request.ExamYear,
                        CentreCode = info.CentreNumber ?? request.CenterNumber,
                        FilePath = savedPath,
                        OcrText = ocrText ?? "",
                        CreatedAt = DateTime.UtcNow,
                        UserId = _currentUserService.GetCurentUserId() ?? 2
                    };
                    await _candidateRepo.AddCandidateDocumentAsync(entity);

                    result.SavedFilePaths.Add(savedPath);
                    }
                catch (Exception ex)
                {
                    // For unexpected exceptions: log a generic ImportError and keep going
                    await LogUnhandledError(ex, request, command.UploadedBy, candidateIndex, result);
                }
            }

            result.TotalCandidates = result.SavedFilePaths.Count;
            return result;
        }

        // ----------------------------------------------------------------------
        //  SUPPORT METHODS
        // ----------------------------------------------------------------------

        private async Task LogOcrError(Exception ex, string savedPath, UploadBatchRequestDTO request,
            string uploadedBy, int index, UploadBatchResult result)
        {
            var err = new ImportError
            {
                FilePath = savedPath,
                FieldName = "OcrText",
                ErrorType = "OCRIssue",
                ErrorMessage = $"OCR failed: {ex.Message}",
                CandidateNumber = null,
                Session = request.ExamYear,
                UploadedBy = uploadedBy
            };

            await _importErrorService.AddErrorsAsync(new[] { err });

            result.Errors.Add($"[{index}] OCR ERROR: {ex.Message}");
        }

        private async Task LogUnhandledError(Exception ex, UploadBatchRequestDTO request,
            string uploadedBy, int index, UploadBatchResult result)
        {
            var err = new ImportError
            {
                FilePath = null,
                FieldName = "Unhandled",
                ErrorType = "UnhandledException",
                ErrorMessage = ex.Message,
                CandidateNumber = null,
                Session = request.ExamYear,
                UploadedBy = uploadedBy
            };

            await _importErrorService.AddErrorsAsync(new[] { err });

            result.Errors.Add($"[{index}] UNHANDLED ERROR: {ex.Message}");
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

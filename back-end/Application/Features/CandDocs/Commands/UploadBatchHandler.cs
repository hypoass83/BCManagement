using Application.Features.CandDocs.Commands;
using Application.Features.CandDocs.Validators;
using Application.Service;
using Domain.DTO.CandDocs;
using Domain.Entities.CandDocs;
using Domain.InterfacesServices.CandDocs;
using Domain.InterfacesServices.Security;
using Domain.InterfacesStores.CandDocs;
using Domain.Models.CandDocs;
using iText.Kernel.Pdf;

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
            ICandidateParser candidateParser,
            ICurrentUserService currentUserService)
        {
            _pdfSplit = pdfSplit;
            _ocr = ocr;
            _fileStore = fileStore;
            _candidateRepo = candidateRepo;
            _importErrorService = importErrorService;
            _candidateParser = candidateParser;
            _currentUserService = currentUserService;
        }

        // ====================================================================================
        //                          MAIN IMPORT HANDLER
        // ====================================================================================
        public async Task<UploadBatchResult> HandleAsync(UploadBatchCommand command, CancellationToken ct = default)
        {
            var request = command.Request ?? throw new ArgumentNullException(nameof(command.Request));
            var result = new UploadBatchResult();

            var sessionStr = request.ExamYear.ToString();
            var examStr = request.ExamCode;
            var centreStr = request.CenterNumber;

            // ---- STEP 0 — Validate source file is .pdf ----
            string srcExt = Path.GetExtension(command.ServerSourceFilePath).ToLowerInvariant();
            if (srcExt != ".pdf")
                throw new Exception($"Invalid file type. Only PDF files are supported: {command.ServerSourceFilePath}");

            // ---- STEP 1 — Split PDF into single pages ----
            var singlePagePdfs = await _pdfSplit.SplitPdfByPageAsync(request.PdfFile);

            // ---- STEP 2 — Group into pairs (2 pages per candidate) ----
            var pairs = new List<(byte[] page1, byte[] page2)>();
            for (int i = 0; i < singlePagePdfs.Count; i += 2)
            {
                var p1 = singlePagePdfs[i];
                byte[] p2 = (i + 1 < singlePagePdfs.Count) ? singlePagePdfs[i + 1] : null;
                pairs.Add((p1, p2));
            }

            int candidateIndex = 0;

            // ====================================================================================
            //                            PROCESS EACH CANDIDATE
            // ====================================================================================
            foreach (var pair in pairs)
            {
                candidateIndex++;

                try
                {
                    string fileName = $"{sessionStr}_{examStr}_{centreStr}_{candidateIndex:D4}.pdf";

                    // ---- Combine Pages ----
                    var combinedPdfBytes = await CreateTwoPagePdfAsync(pair.page1, pair.page2);

                    // ---- Save into success folder temporarily ----
                    var savedPath = await _fileStore.SaveSuccessFileAsync(combinedPdfBytes, sessionStr, examStr, centreStr, fileName);

                    // ---- OCR of page 1 ----
                    string ocrText = "";
                    try
                    {
                        ocrText = await _ocr.ExtractTextFromPdfAsync(pair.page1, 1);
                    }
                    catch (Exception ex)
                    {
                        await LogOcrError(ex, savedPath, request, command.UploadedBy, candidateIndex, result);
                        continue;
                    }

                    var info = _candidateParser.Parse(ocrText);

                    // ---- Validate Extracted Data ----
                    var validator = new DocumentValidator(command.UploadedBy);

                    var validation = validator.Validate(pair.page1, ocrText, info, savedPath, request);

                    // ---- INVALID CASE ----
                    if (!validation.IsValid)
                    {
                        string errorPath = await _fileStore.MoveToErrorFolderAsync(savedPath);

                        var invalidEntity = new CandidateDocument
                        {
                            CandidateName = info.CandidateName,
                            CandidateNumber = info.CandidateNumber,
                            Session = info.SessionYear ?? request.ExamYear,
                            CentreCode = info.CentreNumber ?? centreStr,
                            FormCentreCode = centreStr,
                            FilePath = errorPath,
                            OcrText = ocrText,
                            CreatedAt = DateTime.UtcNow,
                            UserId = _currentUserService.GetCurentUserId() ?? 2,
                            IsValid = false
                        };

                        await _candidateRepo.AddCandidateDocumentAsync(invalidEntity);

                        foreach (var err in validation.Errors)
                            err.CandidateDocumentId = invalidEntity.Id;

                        await _importErrorService.AddErrorsAsync(validation.Errors);

                        result.Errors.Add($"[{candidateIndex}] Validation failed.");
                        continue;
                    }

                    // ---- VALID CASE ----
                    var validEntity = new CandidateDocument
                    {
                        CandidateName = info.CandidateName,
                        CandidateNumber = info.CandidateNumber,
                        Session = info.SessionYear ?? request.ExamYear,
                        CentreCode = info.CentreNumber ?? centreStr,
                        FormCentreCode = centreStr,
                        FilePath = savedPath,
                        OcrText = ocrText,
                        CreatedAt = DateTime.UtcNow,
                        UserId = _currentUserService.GetCurentUserId() ?? 2,
                        IsValid = true
                    };

                    await _candidateRepo.AddCandidateDocumentAsync(validEntity);

                    result.SavedFilePaths.Add(savedPath);
                }
                catch (Exception ex)
                {
                    await LogUnhandledError(ex, request, command.UploadedBy, candidateIndex, result);
                }
            }

            // ====================================================================================
            //                     STEP 9 — SAVE IMPORTED FILE AND DELETE SOURCE
            // ====================================================================================

            byte[] originalBytes = await File.ReadAllBytesAsync(command.ServerSourceFilePath);
            string originalName = Path.GetFileNameWithoutExtension(command.ServerSourceFilePath);
            string originalExt = Path.GetExtension(command.ServerSourceFilePath);

            // ---- Generate unique imported file name ----
            string importedFileName = await GenerateUniqueImportedName(sessionStr, examStr, centreStr, originalName, originalExt);

            // ---- Delete source file ----
            if (File.Exists(command.ServerSourceFilePath))
                File.Delete(command.ServerSourceFilePath);

            // ---- Save in /imported folder ----
            await _fileStore.MoveOriginalImportedPdfAsync(originalBytes, sessionStr, examStr, centreStr, importedFileName);

            result.TotalCandidates = result.SavedFilePaths.Count;
            return result;
        }



        // ====================================================================================
        //                           SUPPORT METHODS
        // ====================================================================================

        private async Task LogOcrError(Exception ex, string savedPath, UploadBatchRequestDTO request,
            string uploadedBy, int index, UploadBatchResult result)
        {
            var err = new ImportError
            {
                FilePath = savedPath,
                FieldName = "OcrText",
                ErrorType = "OCRIssue",
                ErrorMessage = $"OCR failed: {ex.Message}",
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
                Session = request.ExamYear,
                UploadedBy = uploadedBy
            };

            await _importErrorService.AddErrorsAsync(new[] { err });
            result.Errors.Add($"[{index}] UNHANDLED ERROR: {ex.Message}");
        }


        // ====================================================================================
        //                       MERGE TWO PDF PAGES SAFELY (FIXED VERSION)
        // ====================================================================================
        private async Task<byte[]> CreateTwoPagePdfAsync(byte[] page1, byte[] page2)
        {
            using var outMs = new MemoryStream();
            using (var writer = new PdfWriter(outMs))
            using (var dest = new PdfDocument(writer))
            {
                // PAGE 1
                using (var ms1 = new MemoryStream(page1))
                {
                    var reader1 = new PdfReader(ms1);
                    reader1.SetCloseStream(true);   // CRITICAL FIX

                    using (var src1 = new PdfDocument(reader1))
                    {
                        src1.CopyPagesTo(1, src1.GetNumberOfPages(), dest);
                    }
                }

                // PAGE 2
                if (page2 != null)
                {
                    using (var ms2 = new MemoryStream(page2))
                    {
                        var reader2 = new PdfReader(ms2);
                        reader2.SetCloseStream(true);  // CRITICAL FIX

                        using (var src2 = new PdfDocument(reader2))
                        {
                            src2.CopyPagesTo(1, src2.GetNumberOfPages(), dest);
                        }
                    }
                }
            }

            return outMs.ToArray();
        }


        // ====================================================================================
        //                 GENERATE UNIQUE FILENAME: _Tr, _Tr1, _Tr2...
        // ====================================================================================
        private async Task<string> GenerateUniqueImportedName(string session, string exam, string centre, string baseName, string ext)
        {
            string importedFolder = _fileStore.GetImportedFolder(session, exam, centre);


            if (!Directory.Exists(importedFolder))
                Directory.CreateDirectory(importedFolder);

            string fileName = $"{baseName}_Tr{ext}";
            string fullPath = Path.Combine(importedFolder, fileName);

            int counter = 1;

            while (File.Exists(fullPath))
            {
                fileName = $"{baseName}_Tr{counter}{ext}";
                fullPath = Path.Combine(importedFolder, fileName);
                counter++;
            }

            return fileName;
        }


        // ====================================================================================
        //               UPDATE CANDIDATE (USED WITH MANUAL FIX IN UI)
        // ====================================================================================
        public async Task<SimpleResult> UpdateCandidateAsync(UpdateCandidateRequestDTO req)
        {
            var result = new SimpleResult();

            var candidate = await _candidateRepo.GetByIdAsync(req.Id);
            if (candidate == null)
            {
                result.Error = "Candidate not found.";
                return result;
            }

            candidate.CandidateName = req.CandidateName;
            candidate.CandidateNumber = req.CandidateNumber;
            candidate.Session = req.Session;
            candidate.CentreCode = req.CentreCode;

            candidate.IsValid = true;
            await _candidateRepo.UpdateAsync(candidate);

            result.Success = true;
            result.Message = "Candidate updated successfully. Now call validate-document.";
            return result;
        }


        // ====================================================================================
        //              MOVE FROM /errors → /success AFTER MANUAL FIX
        // ====================================================================================
        public async Task<SimpleResult> ValidateCorrectedDocumentAsync(int id)
        {
            var result = new SimpleResult();

            var doc = await _candidateRepo.GetByIdAsync(id);
            if (doc == null)
            {
                result.Error = "Document not found.";
                return result;
            }

            if (!doc.IsValid)
            {
                result.Error = "Document still invalid. Fix data first.";
                return result;
            }

            if (!doc.FilePath.Contains("errors"))
            {
                result.Error = "Document already in success folder.";
                return result;
            }

            string newPath = await _fileStore.MoveToSuccessFolderAsync(doc.FilePath);

            doc.FilePath = newPath;
            await _candidateRepo.UpdateAsync(doc);

            await _importErrorService.ClearErrorsForDocument(id);

            result.Success = true;
            result.Message = "Document validated and moved to success.";
            result.NewFilePath = newPath;

            return result;
        }
    }
}

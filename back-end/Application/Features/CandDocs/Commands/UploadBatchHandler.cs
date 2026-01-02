using Application.Services.Concurrency;
using Domain.DTO.CandDocs;
using Domain.Entities.CandDocs;
using Domain.InterfacesServices.CandDocs;
using Domain.InterfacesStores.CandDocs;
using Domain.Models.CandDocs;
using Infrastructure.Context;
using Infrastructure.Services.CandDocs;
using Microsoft.Extensions.Logging;

namespace Application.Features.CandDocs.Commands
{
    public class UploadBatchHandler
    {
        private readonly IFileStore _fileStore;
        private readonly ITesseractService _ocr;
        private readonly ICandidateRepository _repo;
        private readonly ICandidateParser _candidateParser;
        private readonly FsContext _db;
        private readonly ILogger<UploadBatchHandler> _logger;

        public UploadBatchHandler(IFileStore fileStore, ITesseractService ocr, ICandidateRepository repo, ICandidateParser candidateParser, FsContext db, ILogger<UploadBatchHandler> logger)
        {
            _fileStore = fileStore;
            _ocr = ocr;
            _repo = repo;   
            _candidateParser = candidateParser;
            _db = db;
            _logger = logger;
        }

        private string ExtractBatchNumber(string sourceFilePath)
        {
            var fileName = Path.GetFileNameWithoutExtension(sourceFilePath);

            // attendu: 2025_7100_11133_002
            var parts = fileName.Split('_');

            if (parts.Length >= 4)
                return parts[^1]; // dernier segment = batch

            return "000";
        }


        public async Task<UploadBatchResult> HandleAsync(UploadBatchRequestDTO request)
        {
            string sourceFileName = Path.GetFileName(request.ServerSourceFilePath);
            var result = new UploadBatchResult
            {
                SavedFilePaths = new List<string>()
            };

            //await OcrExecutionGate.Semaphore.WaitAsync();

            //await using var tx = await _db.Database.BeginTransactionAsync();
           
            try
            {

                //  1. Detect if file already imported before
                bool alreadyImported = await _repo.HasBatchBeenImportedAsync(
                    request.ServerSourceFilePath,
                    request.ExamYear,
                    request.ExamCode,
                    request.CenterNumber);

                //  2. If previously imported → delete old data + files
                if (alreadyImported)
                {
                    await _repo.DeleteDocumentsForBatchAsync(request.ExamYear, request.ExamCode, request.CenterNumber);
                    await _fileStore.DeleteBatchFolderAsync(request.ExamYear.ToString(), request.ExamCode, request.CenterNumber);
                }

                // ----------------------------------------------------------
                // 1. READ THE ORIGINAL PDF INTO MEMORY (NO FILE LOCKING!)
                // ----------------------------------------------------------
                byte[] originalBytes = await File.ReadAllBytesAsync(request.ServerSourceFilePath);

                try
                {
                    using var test = PdfUtils.OpenLenient(originalBytes);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "PDF non standard détecté, tentative de réparation");

                    originalBytes = PdfUtils.RewritePdf(originalBytes);
                }

                var existingCandidates = await _repo.GetExistingCandidatesAsync(request.ExamYear,request.ExamCode);

                var existingSet = new HashSet<string>(
                    existingCandidates.Select(c =>
                        $"{Normalize(c.CandidateNumber)}|{Normalize(c.CandidateName)}"
                    )
                );

                // ----------------------------------------------------------
                // 2. SPLIT INTO SINGLE PAGES (PAGE 1 + PAGE 2)
                // ----------------------------------------------------------
                var pages = await PdfUtils.SplitPdfByPageAsync(originalBytes);

                string batchNumber = ExtractBatchNumber(request.ServerSourceFilePath);

                int idx = 0;

                for (int i = 0; i < pages.Count; i += 2)
                {
                    idx++;

                    byte[] page1 = pages[i];
                    byte[] page2 = (i + 1 < pages.Count) ? pages[i + 1] : null;

                    // ----------------------------------------------------------
                    // 3. OCR ONLY PAGE 1 (PERFORMANCE + BETTER ACCURACY)
                    // ----------------------------------------------------------
                    //string ocrText = await _ocr.ExtractTextFromPdfAsync(page1, 1);
                    string ocrText;

                    /*await OcrExecutionGate.Semaphore.WaitAsync();
                    try
                    {
                        ocrText = await _ocr.ExtractTextFromPdfAsync(page1, 1);
                    }
                    finally
                    {
                        OcrExecutionGate.Semaphore.Release();
                    }*/

                    bool semaphoreAcquired = false;

                    try
                    {
                        await OcrExecutionGate.Semaphore.WaitAsync();
                        semaphoreAcquired = true;

                        ocrText = await _ocr.ExtractTextFromPdfAsync(page1, 1);
                    }
                    finally
                    {
                        if (semaphoreAcquired)
                        {
                            try
                            {
                                OcrExecutionGate.Semaphore.Release();
                            }
                            catch (Exception ex)
                            {
                                _logger.LogWarning(ex, ex.Message + " - " + ex.InnerException);

                            }
                        }
                            
                    }


                    // ----------------------------------------------------------
                    // 4. EXTRACT REAL CANDIDATE INFO USING THE PARSER
                    // ----------------------------------------------------------
                    CandidateInfo info = _candidateParser.Parse(ocrText);

                    var candidateKey = $"{Normalize(info.CandidateNumber)}|{Normalize(info.CandidateName)}";

                    if (existingSet.Contains(candidateKey))
                    {
                        _logger.LogWarning(
                            "Duplicate candidate skipped: {CIN} - {Name}",
                            info.CandidateNumber,
                            info.CandidateName
                        );

                        // 👉 passer au candidat suivant (PAS de PDF, PAS de DB)
                        continue;
                    }

                    existingSet.Add(candidateKey);

                    // ----------------------------------------------------------
                    // 5. VALIDATION: TRUE VALIDITY BASED ON EXTRACTED DATA
                    // ----------------------------------------------------------
                    bool isValid = ValidateExtractedInfo(info, request);

                    // ----------------------------------------------------------
                    // 6. MERGE PAGE 1 + PAGE 2
                    // ----------------------------------------------------------
                    byte[] mergedPdf = await PdfUtils.MergeTwoPagesAsync(page1, page2);

                    string fileName = $"{request.ExamYear}_{request.ExamCode}_{request.CenterNumber}_{batchNumber}_{idx:D4}.pdf";

                    string savedPath;

                    if (isValid)
                    {
                        savedPath = await _fileStore.SaveSuccessFileAsync(
                            mergedPdf,
                            request.ExamYear.ToString(),
                            request.ExamCode,
                            request.CenterNumber,
                            fileName
                        );
                    }
                    else
                    {
                        savedPath = await _fileStore.SaveErrorFileAsync(
                            mergedPdf,
                            request.ExamYear.ToString(),
                            request.ExamCode,
                            request.CenterNumber,
                            fileName
                        );
                    }

                    result.SavedFilePaths.Add(savedPath);

                    await using var tx = await _db.Database.BeginTransactionAsync();
                    try
                    {
                        // ----------------------------------------------------------
                        // 7. SAVE INTO DATABASE
                        // ----------------------------------------------------------

                        var document = new CandidateDocument
                        {
                            CandidateNumber = info.CandidateNumber,
                            CandidateName = info.CandidateName,
                            CentreCode = info.CentreNumber ?? request.CenterNumber,
                            FormCentreCode = request.CenterNumber,
                            Session = request.ExamYear,
                            FilePath = savedPath,
                            OcrText = ocrText,
                            IsValid = isValid,
                            CreatedAt = DateTime.UtcNow,
                            UserId = request.UploadedBy,
                            ExamCode = request.ExamCode
                        };
                        await _repo.AddAsync(document);
                        // ----------------------------------------------------------
                        // 8. IF INVALID, STORE ERROR DETAILS
                        // ----------------------------------------------------------
                        if (!isValid)
                        {
                            var importError = new ImportError
                            {
                                CandidateDocumentId = document.Id,
                                FilePath = savedPath,
                                FieldName = "OCR / PARSING",
                                ErrorType = "ExtractionFailed",
                                ErrorMessage = BuildErrorMessage(info, request),
                                Session = request.ExamYear,
                                UploadedBy = request.UploadedBy.ToString(),
                                CandidateName = info.CandidateName ?? "",
                                CandidateNumber = info.CandidateNumber ?? "",
                            };

                            await _repo.AddImportErrorsAsync(new[] { importError });
                        }

                        await tx.CommitAsync();
                    }
                    catch
                    {
                        await tx.RollbackAsync();
                        throw;
                    }

                }

                // ----------------------------------------------------------
                // 9. MOVE ORIGINAL FILE → imported FOLDER (+ DELETE SOURCE)
                // ----------------------------------------------------------
                string importedName =
                    $"{Path.GetFileNameWithoutExtension(request.ServerSourceFilePath)}_Tr{Path.GetExtension(request.ServerSourceFilePath)}";

                string importedPath = await _fileStore.MoveOriginalImportedPdfAsync(
                    originalBytes,
                    request.ExamYear.ToString(),
                    request.ExamCode,
                    request.CenterNumber,
                    importedName
                );

                if (File.Exists(request.ServerSourceFilePath))
                    File.Delete(request.ServerSourceFilePath);

                await _repo.LogImportedBatchAsync(sourceFileName, request.ExamYear, request.ExamCode, request.CenterNumber);

                // ----------------------------------------------------------
                // 10. FINAL RESULT
                // ----------------------------------------------------------
                result.ImportedPath = importedPath;
                result.TotalCandidates = result.SavedFilePaths.Count;

                // Everything OK → commit!
                //await tx.CommitAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "PDF processing failed for {File} (Year={Year}, Exam={Exam}, Centre={Centre})",
                    sourceFileName,
                    request.ExamYear,
                    request.ExamCode,
                    request.CenterNumber
                );

                //await tx.RollbackAsync();
                throw;
            }

            //finally
            //{
            //    OcrExecutionGate.Semaphore.Release();
            //}
            return result;
            
        }

        private static string Normalize(string? value)
        {
            return value?
                .Trim()
                .ToUpperInvariant()
                .Replace("  ", " ") ?? string.Empty;
        }

        private bool ValidateExtractedInfo(CandidateInfo info, UploadBatchRequestDTO req)
        {
            if (info == null) return false;

            if (string.IsNullOrWhiteSpace(info.CandidateNumber))
                return false;
            if (info.CandidateNumber.Length!=9)
                return false;

            if (string.IsNullOrWhiteSpace(info.CandidateName))
                return false;

            if (info.CandidateName.Contains("GENERAL") || info.CandidateName.Contains("CERTIFICATE") || info.CandidateName.Contains("CANDIDATE"))
            {
                return false;
            }

            // Centre number extracted must match uploaded centre (to protect integrity)
            if (!string.IsNullOrWhiteSpace(info.CentreNumber))
            {
                if (info.CentreNumber != req.CenterNumber)
                    return false;
            }

            // Valid session? Between 2000 and 2030
            /*if (info.SessionYear.HasValue)
            {
                if (info.SessionYear < 2000 || info.SessionYear > 2030)
                    return false;

                if (info.SessionYear != req.ExamYear)
                    return false;
            }*/

            return true;
        }

        private string BuildErrorMessage(CandidateInfo info, UploadBatchRequestDTO req)
        {
            List<string> errors = new();

            if (string.IsNullOrWhiteSpace(info.CandidateNumber))
                errors.Add("Candidate Number not detected");

            if (string.IsNullOrWhiteSpace(info.CandidateName))
                errors.Add("Candidate Name not detected");

            if (!string.IsNullOrWhiteSpace(info.CentreNumber) &&
                 info.CentreNumber != req.CenterNumber)
            {
                errors.Add($"Centre mismatch: extracted {info.CentreNumber}, expected {req.CenterNumber}");
            }

            /*if (info.SessionYear.HasValue &&
                (info.SessionYear < 2000 || info.SessionYear > 2030))
            {
                errors.Add($"Invalid session year: {info.SessionYear}");
            }*/

            return string.Join("; ", errors);
        }

        public async Task<List<UploadBatchResult>> HandleMultipleAsync(List<UploadBatchRequestDTO> requests)
        {
            //var tasks = requests.Select(req =>Task.Run(() => HandleAsync(req)));
            var tasks = requests.Select(req => HandleAsync(req));


            var results = await Task.WhenAll(tasks);
            return results.ToList();
        }


        /*public async Task<List<UploadBatchResult>> HandleMultipleAsync(List<UploadBatchRequestDTO> requests)
        {
            var results = new List<UploadBatchResult>();

            foreach (var req in requests)
            {
                //  Reuse your existing handler
                var result = await HandleAsync(req);
                results.Add(result);
            }

            return results;
        }*/

        public async Task<List<UploadBatchResult>> HandleMultipleFilesAsync(List<string> serverFilePaths, int examYear, string examCode, string centerNumber, int uploadedBy)
        {
            var list = new List<UploadBatchRequestDTO>();

            foreach (var path in serverFilePaths)
            {
                list.Add(new UploadBatchRequestDTO
                {
                    ServerSourceFilePath = path,
                    ExamYear = examYear,
                    ExamCode = examCode,
                    CenterNumber = centerNumber,
                    UploadedBy = uploadedBy
                });
            }

            return await HandleMultipleAsync(list);
        }

    }
}
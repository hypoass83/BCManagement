using Application.Features.CandDocs.Commands;
using Application.Features.CandDocs.Queries;
using Domain.DTO.CandDocs;
using iText.Kernel.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/document")]
    public class DocumentController : ControllerBase
    {
        private readonly UploadBatchHandler _handler;
        private readonly IConfiguration _config;
        private readonly GetImportedBatchesHandler _checkHandler;
        private readonly ILogger<DocumentController> _logger;
        public DocumentController(IConfiguration config, UploadBatchHandler handler, GetImportedBatchesHandler checkHandler, ILogger<DocumentController> logger )
        {
            _handler = handler;
            _config = config;
            _checkHandler = checkHandler;
            _logger = logger;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
                throw new UnauthorizedAccessException("User not authenticated");

            return int.Parse(userIdClaim.Value);
        }



        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] UploadFormDto form)
        {
            if (form.File == null || form.File.Length == 0) return BadRequest("File is required.");

            var uploadedBy = GetCurrentUserId();

            // save temp file
            var tmp = Path.Combine(Path.GetTempPath(), form.File.FileName);

            using (var fs = new FileStream(tmp, FileMode.Create))
            {
                await form.File.CopyToAsync(fs);
            }

            var dto = new UploadBatchRequestDTO
            {
                ServerSourceFilePath = tmp,
                ExamYear = form.ExamYear,
                ExamCode = form.ExamCode,
                CenterNumber = form.CenterNumber,
                UploadedBy = uploadedBy
            };

            var res = await _handler.HandleAsync(dto);
            return Ok(res);
        }

        [HttpPost("upload-multiple")]
        public async Task<IActionResult> UploadMultiple([FromForm] UploadDocumentsDto form)
        {
            if (form.Files == null || form.Files.Count == 0)
                return BadRequest("Please select at least one PDF file.");
            var uploadedBy = GetCurrentUserId();
            string currentFileName = "";

            try
            {
                string uploadFolder = Path.Combine("Uploads", form.ExamYear.ToString(), form.ExamCode, form.CenterNumber);
                    Directory.CreateDirectory(uploadFolder);
                    List<string> serverFilePaths = new();
                    foreach (var file in form.Files)
                    {
                        currentFileName = file.FileName; // <-- capture here
                        string filePath = Path.Combine(uploadFolder, file.FileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        serverFilePaths.Add(filePath);
                    }
                    var results = await _handler.HandleMultipleFilesAsync(serverFilePaths,form.ExamYear,form.ExamCode,form.CenterNumber, uploadedBy);
                    return Ok(new
                    {
                        message = $"{results.Count} files processed",
                        results
                    });
                }
            
            catch (Exception ex)
            {
                // log exact error
                _logger.LogError(
                     ex,
                     "PDF processing failed. File: {File}, ExamYear: {Year}, ExamCode: {Code}, Centre: {Centre}",
                     currentFileName,
                     form.ExamYear,
                     form.ExamCode,
                     form.CenterNumber
                 );

                return BadRequest(new
                {
                    message = "Corrupted or unreadable PDF",
                    file = currentFileName
                });
            }
        }

        [HttpGet("imported-batches")]
        public async Task<IActionResult> GetImportedBatches([FromServices] GetImportedBatchesHandler handler)
        {
            var batches = await handler.HandleAsync();
            return Ok(batches);
        }

        [HttpPost("check-exists")]
        public async Task<IActionResult> CheckIfAlreadyImported([FromBody] List<string> fileNames)
        {
            var existing = await _checkHandler.HandleImportedFilesAsync(fileNames);
            return Ok(existing);
        }

        


    }
}

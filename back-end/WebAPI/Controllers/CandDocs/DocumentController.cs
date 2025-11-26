using Microsoft.AspNetCore.Mvc;
using BCDocumentManagement.Application.Features.CandDocs.Commands;
using BCDocumentManagement.Application.Features.CandDocs.Queries;

using Domain.DTO.CandDocs;

using Application.Features.CandDocs.Commands;
using Application.Features.CandDocs.Queries;
using Microsoft.AspNetCore.Http;
using System.Reflection.Metadata;

namespace BCDocumentManagement.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentController : ControllerBase
    {
        private readonly UploadBatchHandler _uploadHandler;
        private readonly SearchDocumentHandler _searchHandler;
        private readonly IWebHostEnvironment _env; // optional, for file returns
        private readonly ExtractOcrFromPage1Handler _ocrHandler;

        public DocumentController(UploadBatchHandler uploadHandler, SearchDocumentHandler searchHandler, IWebHostEnvironment env, ExtractOcrFromPage1Handler ocrHandler)
        {
            _uploadHandler = uploadHandler;
            _searchHandler = searchHandler;
            _env = env;
            _ocrHandler = ocrHandler;
        }

//        [HttpPost("ocr-extract")]
//        public async Task<IActionResult> ExtractOcr([FromBody] ExtractOcrFromPage1 request)
//        {
//            if (request == null || request.PdfFile == null) return BadRequest("PdfFile required");
//            try
//            {
//                var text = await _ocrHandler.Handle(request);
//                return Ok(new { text });
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, ex.Message.ToString());
//            }
//}

//        // ------------------------------------------------------------
//        // VERSION 2: MULTIPART (IFormFile) for Angular or Swagger
//        // ------------------------------------------------------------
//        [HttpPost("ocr-extract-form")]
//        [Consumes("multipart/form-data")]
//        public async Task<IActionResult> ExtractOcrForm([FromForm] IFormFile pdfFile, [FromForm] int pageNumber = 1)
//        {
//            if (pdfFile == null || pdfFile.Length == 0)
//                return BadRequest("pdfFile is required.");

//            using var ms = new MemoryStream();
//            await pdfFile.CopyToAsync(ms);
//            var bytes = ms.ToArray();

//            var request = new ExtractOcrFromPage1
//            {
//                PdfFile = bytes,
//                PageNumber = pageNumber
//            };
//            try
//            {
//                var result = await _ocrHandler.Handle(request);
//                return Ok(new { text = result });
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, ex.Message.ToString());
//            }
//        }

        /// <summary>
        /// Upload a batch PDF (form-data).
        /// Form fields: file (IFormFile), examYear (int), examCode (int), centerNumber (int)
        /// </summary>
        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> Upload([FromForm] UploadDocumentForm form)
        {
            if (form.File == null || form.File.Length == 0) return BadRequest("File is required.");

            // read incoming file into memory
            byte[] pdfBytes;
            using (var ms = new MemoryStream())
            {
                await form.File.CopyToAsync(ms);
                pdfBytes = ms.ToArray();
            }

            var requestDto = new UploadBatchRequestDTO
            {
                PdfFile = pdfBytes,
                ExamYear = form.ExamYear,
                ExamCode = form.ExamCode,
                CenterNumber = form.CenterNumber
            };

            var command = new UploadBatchCommand
            {
                Request = requestDto,
                UploadedBy = User?.Identity?.Name ?? "anonymous"
            };

            try
            {
                var res = await _uploadHandler.HandleAsync(command);
                return Ok(res);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message.ToString());
            }
        }

        ///// <summary>
        ///// Upload a batch PDF from the scanner.
        ///// </summary>
        //[HttpPost("upload-batch")]
        //public async Task<IActionResult> UploadBatch([FromBody] UploadBatchRequestDTO dto)
        //{
        //    if (dto.PdfFile == null || dto.PdfFile.Length == 0)
        //        return BadRequest("PDF file is missing.");

        //    var result = await _uploadHandler.Handle(dto);

        //    if (!result.Success)
        //        return BadRequest(result.Message);

        //    return Ok(new
        //    {
        //        success = true,
        //        message = "Batch processed successfully.",
        //        savedDocuments = result.DocumentsCount
        //    });
        //}

        /// <summary>
        /// Search candidate documents
        /// </summary>
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string name, [FromQuery] string candidatenumber, [FromQuery] string centrenumber, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
        {
            var query = new SearchDocumentQuery
            {
                CandidateName = name,
                CandidateNumber = candidatenumber,
                CenterNumber = centrenumber,
                Page = page,
                PageSize = pageSize
            };

            var items = await _searchHandler.HandleAsync(query);
            return Ok(items);
        }

        /// <summary>
        /// Return a candidate PDF file for download/preview
        /// </summary>
        [HttpGet("{id}/file")]
        public async Task<IActionResult> GetFile([FromRoute] int id)
        {
            // simple implementation: query repository and return file
            // to avoid adding repo dependency in controller, you can create a small store or repo injection
            // For simplicity, resolve ICandidateRepository from HttpContext.RequestServices
            var repo = HttpContext.RequestServices.GetService<Domain.InterfacesStores.CandDocs.ICandidateRepository>();
            var item = (await repo.SearchAsync(null, null, null)).FirstOrDefault(d => d.Id == id);
            if (item == null) return NotFound();

            if (!System.IO.File.Exists(item.FilePath)) return NotFound("File not found on disk.");

            var bytes = await System.IO.File.ReadAllBytesAsync(item.FilePath);
            return File(bytes, "application/pdf", Path.GetFileName(item.FilePath));
        }
    }
}

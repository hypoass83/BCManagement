using Domain.DTO.CandDocs;
using Domain.Entities.CandDocs;
using Domain.Models.CandDocs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.CandDocs.Validators
{
    public class DocumentValidationResult
    {
        public bool IsValid => !Errors.Any();
        public List<ImportError> Errors { get; } = new List<ImportError>();
    }
    public class DocumentValidator
    {
        private readonly string _uploadedBy;
        public DocumentValidator(string uploadedBy = "system")
        {
            _uploadedBy = uploadedBy;
        }

        public DocumentValidationResult Validate(
            byte[] page1Pdf,
            string ocrText,
            CandidateInfo info,
            string savedPath,
            UploadBatchRequestDTO request)
        {
            var result = new DocumentValidationResult();

            // Example: CandidateNumber required and numeric
            if (string.IsNullOrWhiteSpace(info.CandidateNumber))
            {
                result.Errors.Add(new ImportError
                {
                    FilePath = savedPath,
                    CandidateNumber = info.CandidateNumber,
                    CandidateName = info.CandidateName,
                    FieldName = "CandidateNumber",
                    ErrorType = "MissingField",
                    ErrorMessage = "Candidate number is missing.",
                    Session = request.ExamYear,
                    UploadedBy = _uploadedBy
                });
            }
            else if (!info.CandidateNumber.All(char.IsDigit))
            {
                result.Errors.Add(new ImportError
                {
                    FilePath = savedPath,
                    CandidateNumber = info.CandidateNumber,
                    CandidateName = info.CandidateName,
                    FieldName = "CandidateNumber",
                    ErrorType = "InvalidFormat",
                    ErrorMessage = "Candidate number must be numeric.",
                    Session = request.ExamYear,
                    UploadedBy = _uploadedBy
                });
            }

            // CandidateName not OCR garbage
            if (string.IsNullOrWhiteSpace(info.CandidateName) ||
                info.CandidateName.ToUpperInvariant().Contains("CERTIFICATE"))
            {
                result.Errors.Add(new ImportError
                {
                    FilePath = savedPath,
                    CandidateNumber = info.CandidateNumber,
                    CandidateName = info.CandidateName,
                    FieldName = "CandidateName",
                    ErrorType = "OCRIssue",
                    ErrorMessage = "Candidate name probably not detected by OCR.",
                    Session = request.ExamYear,
                    UploadedBy = _uploadedBy
                });
            }

            // File existence check (optional, if file saved locally accessible)
            if (string.IsNullOrWhiteSpace(savedPath) || !File.Exists(savedPath))
            {
                result.Errors.Add(new ImportError
                {
                    FilePath = savedPath,
                    CandidateNumber = info.CandidateNumber,
                    CandidateName = info.CandidateName,
                    FieldName = "FilePath",
                    ErrorType = "FileNotFound",
                    ErrorMessage = "Saved file not found on disk.",
                    Session = request.ExamYear,
                    UploadedBy = _uploadedBy
                });
            }

            // Example: session year must be reasonable
            var session = info.SessionYear ?? request.ExamYear;
            if (session < 2000 || session > 2030)
            {
                result.Errors.Add(new ImportError
                {
                    FilePath = savedPath,
                    CandidateNumber = info.CandidateNumber,
                    CandidateName = info.CandidateName,
                    FieldName = "Session",
                    ErrorType = "InvalidFormat",
                    ErrorMessage = $"Session year {session} out of expected range.",
                    Session = session,
                    UploadedBy = _uploadedBy
                });
            }


                // You can add more checks (CentreNumber existence, OCRText length, banned characters, etc.)

                return result;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.CandDocs
{
    public class ImportError
    {
        public int Id { get; set; }
        public string FilePath { get; set; }
        public string CandidateNumber { get; set; }
        public string CandidateName { get; set; }
        public string FieldName { get; set; }
        public string ErrorType { get; set; }        // MissingField, InvalidFormat, OCRIssue, FileNotFound...
        public string ErrorMessage { get; set; }
        public int? Session { get; set; }
        public DateTime ImportDate { get; set; } = DateTime.UtcNow;
        public string UploadedBy { get; set; }
        // NEW FIELD → FK to CandidateDocument
        public int? CandidateDocumentId { get; set; }
        public virtual CandidateDocument CandidateDocument { get; set; }
    }
}

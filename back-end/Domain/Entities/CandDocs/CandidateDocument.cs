using Domain.Entities.Security;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.CandDocs
{
    /// <summary>
    /// Entité représentant une mission professionnelle
    /// </summary>
    public class CandidateDocument
    {
        [Key]
        public int Id { get; set; }
        public int Session { get; set; } 
        public string CentreCode { get; set; } = "";
        public string CandidateNumber { get; set; }="";
        public string CandidateName { get; set; }="";
        public string FilePath { get; set; } = ""; // path to the 2-page candidate pdf
        public string OcrText { get; set; } = "";  // OCR result of page 1
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Relation avec user
        [Required]
        public int UserId { get; set; }
        
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }

        public int? ExamCenterId { get; set; }

        [ForeignKey("ExamCenterId")]
        public virtual ExamCenter? ExamCenter { get; set; }
        // NEW FIELD → used to determine error/success
        public bool IsValid { get; set; } = false;

        // NAVIGATION — list of all validation errors for this document
        public virtual ICollection<ImportError> ImportErrors { get; set; }

        public string FormCentreCode { get; set; } = "";

    }
}

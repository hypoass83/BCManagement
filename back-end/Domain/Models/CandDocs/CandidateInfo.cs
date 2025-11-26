using Domain.Entities.CandDocs;
using Domain.Models.Security;

namespace Domain.Models.CandDocs
{
    /// <summary>
    /// Modèle de retour pour une mission
    /// </summary>
 
    public class CandidateInfo
    {
        public string CandidateNumber { get; set; } = "";
        public string CandidateName { get; set; } = "";
        public string CentreNumber { get; set; } = "";
        public int? SessionYear { get; set; } // e.g. 2025 for June 2025
        public string RawOcrText { get; set; } = "";
    }
  
}
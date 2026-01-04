using MediatR;

namespace Application.Features.ImportErrors.Commands
{
    public class FixImportErrorCommand : IRequest<bool>
    {
        public int DocumentId { get; set; }

        public int Session { get; set; }
        public string ExamCode { get; set; }
        public string CentreCode { get; set; }

        public string CandidateNumber { get; set; }
        public string CandidateName { get; set; }

        //  CONTEXTE ATTENDU (formulaire parent)
        public int ExpectedSession { get; set; }
        public string ExpectedExamCode { get; set; }
        public string ExpectedCentreCode { get; set; }

        //  NEW
        public bool ForceCentreCorrection { get; set; }
    }
}


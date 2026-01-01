using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.DTO.Dashboard;
using Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Domain.Constants;


namespace Application.Features.Dashboard.Queries
{
    public class GetImportDashboardStatsHandler : IRequestHandler<GetImportDashboardStatsQuery, ImportDashboardStatsDto>
    {
        private readonly FsContext _context;

        public GetImportDashboardStatsHandler(FsContext context)
        {
            _context = context;
        }

        public async Task<ImportDashboardStatsDto> Handle(GetImportDashboardStatsQuery request, CancellationToken cancellationToken)
        {
            // 1️⃣ Déterminer la session (la plus récente si 0)
            var session = request.Session;

            if (session == 0)
            {
                session = await _context.CandidateDocuments
                    .MaxAsync(x => x.Session, cancellationToken);
            }

            // 2️⃣ Agrégation PAR CENTRE + EXAMEN
            var centreStats = await _context.CandidateDocuments
                .Where(x => x.Session == session)
                .GroupBy(x => new { x.ExamCode, x.FormCentreCode })
                .Select(g => new
                {
                    ExamCode = g.Key.ExamCode,
                    CentreCode = g.Key.FormCentreCode,
                    HasSuccess = g.Any(x => x.IsValid),
                    HasError = g.Any(x => !x.IsValid)
                })
                .ToListAsync(cancellationToken);

            // 3️⃣ Agrégation PAR CANDIDAT + EXAMEN
            var candidateStats = await _context.CandidateDocuments.Where(x => x.Session == session)
                .GroupBy(x => x.ExamCode)
                .Select(g => new
                {
                    ExamCode = g.Key,
                    Total = g.Count(),
                    Success = g.Count(x => x.IsValid),
                    Error = g.Count(x => !x.IsValid)
                })
                .ToListAsync(cancellationToken);

            // 4️⃣ Construire les cards dashboard
            var examCards = new List<ExamDashboardCardDto>();

            foreach (var exam in ExamConstants.Exams)
            {
                var examCentres = centreStats
                    .Where(x => x.ExamCode == exam.Key);

                var totalCentres = examCentres.Count();
                var successCentres = examCentres.Count(x => x.HasSuccess && !x.HasError);
                var errorCentres = examCentres.Count(x => x.HasError);

                var examCandidateStats = candidateStats
                    .FirstOrDefault(x => x.ExamCode == exam.Key);

                examCards.Add(new ExamDashboardCardDto
                {
                    ExamCode = exam.Key,
                    ExamLabel = exam.Value,

                    //  Centres
                    TotalCentres = totalCentres,
                    SuccessCentres = successCentres,
                    ErrorCentres = errorCentres,
                    SuccessRate = totalCentres == 0
                        ? 0
                        : Math.Round((double)successCentres / totalCentres * 100, 2),

                    //  Candidats
                    TotalCandidates = examCandidateStats?.Total ?? 0,
                    SuccessCandidates = examCandidateStats?.Success ?? 0,
                    ErrorCandidates = examCandidateStats?.Error ?? 0
                });
            }

            // 5️⃣ Résultat final
            return new ImportDashboardStatsDto
            {
                Session = session,
                Exams = examCards
            };
        }


    }

}

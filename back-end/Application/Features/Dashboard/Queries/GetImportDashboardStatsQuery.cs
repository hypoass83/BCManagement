using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.DTO.Dashboard;
using MediatR;

namespace Application.Features.Dashboard.Queries
{
    public record GetImportDashboardStatsQuery(int Session) : IRequest<ImportDashboardStatsDto>;
}

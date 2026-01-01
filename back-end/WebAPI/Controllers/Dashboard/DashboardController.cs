using Application.Features.Dashboard.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Dashboard
{
    [ApiController]
    [Route("api/dashboard")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly IMediator _mediator;

        public DashboardController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("import-stats")]
        public async Task<IActionResult> GetImportStats([FromQuery] int session)
        {
            var result = await _mediator.Send(new GetImportDashboardStatsQuery(session));

            return Ok(result);
        }
    }

}

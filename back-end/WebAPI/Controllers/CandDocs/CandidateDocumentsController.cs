using Application.Features.CandDocs.Queries;
using Domain.DTO.CandDocs;
using Domain.DTO.Requests;
using Infrastructure.Context;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/candidate-documents")]
public class CandidateDocumentsController : ControllerBase
{
    private readonly IMediator _mediator;

    public CandidateDocumentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("search")]
    public async Task<IActionResult> Search(    [FromBody] SearchCandidateDocumentsRequest request,   CancellationToken cancellationToken)
    {
        var query = new SearchDocumentQuery
        {
            CandidateName = request.CandidateName.Trim(),
            CandidateNumber = request.CandidateNumber,
            CenterNumber = request.CenterNumber,
            ExamCode = request.ExamCode,
            Session = request.Session,
            Page = request.Page,
            PageSize = request.PageSize
        };

        var result = await _mediator.Send(query, cancellationToken);

        return Ok(result);
    }

    [HttpGet("{id}/file")]
    public async Task<IActionResult> GetFile( int id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetCandidateDocumentFileQuery { DocumentId = id },
            cancellationToken);

        if (result == null)
            return NotFound();

        return result;
    }

    [HttpGet("{id:int}/autofill")]
    public async Task<ActionResult<CandidateAutoFillDto>> AutoFill(int id)
    {
        var result = await _mediator.Send(new AutoFillCandidateDocumentQuery(id));

        if (result == null)
            return NotFound();

        return Ok(result);
    }

}

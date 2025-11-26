// using Application.Domain;
using Domain.DTO;
using Domain.Models;
using Domain.InterfacesStores.Security;
using Domain.Entities.Configurations;
using Microsoft.AspNetCore.Mvc;
using Domain.InterfacesServices.Security;
using Domain.Models.Security;
using Microsoft.AspNetCore.Authorization;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/jobs/")]
    [Authorize]
    public class JobController : ControllerBase
    {
        IJobService _JobService;

        public JobController(IJobService JobService)
        {
            _JobService = JobService;
        }

        [HttpPost]
        public ActionResult<JobModel> CreateJob(JobModel JobModel)
        {
            var created = _JobService.CreateJob(JobModel);
            if (created == null) return BadRequest();
            return CreatedAtAction(nameof(GetJobById), new { JobId = created.JobID }, created);
        }


        [HttpGet("{JobId}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<JobModel> GetJobById(int JobId)
        {
            var Job = _JobService.GetJobById(JobId);
            if (Job == null)
            {
                return NotFound();
            }

            return Ok(Job);
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<JobModel>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<List<JobModel>> GetAllJobs()
        {
            var Jobs = _JobService.GetAllJobs();
            if (Jobs == null)
            {
                return NotFound();
            }

            return Ok(Jobs);
        }

        [HttpPut]
        public ActionResult<JobModel> UpdateJob(JobModel JobModel)
        {
            var updated = _JobService.UpdateJob(JobModel);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(bool))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteJob(int JobId)
        {
            var result = _JobService.DeleteJob(JobId);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

    }
}
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
    [Route("api/branchs/")]
    [Authorize]
    public class BranchController : ControllerBase
    {
        IBranchService _BranchService;

        public BranchController(IBranchService BranchService)
        {
            _BranchService = BranchService;
        }

        [HttpPost]
        public ActionResult<BranchModel> CreateBranch(BranchModel BranchModel)
        {
            var created = _BranchService.CreateBranch(BranchModel);
            if (created == null) return BadRequest();
            return CreatedAtAction(nameof(GetBranchById), new { BranchId = created.BranchID }, created);
        }


        [HttpGet("{BranchId}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<BranchModel> GetBranchById(int BranchId)
        {
            var Branch = _BranchService.GetBranchById(BranchId);
            if (Branch == null)
            {
                return NotFound();
            }

            return Ok(Branch);
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<BranchModel>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<List<BranchModel>> GetAllBranchs()
        {
            var Branchs = _BranchService.GetAllBranchs();
            if (Branchs == null)
            {
                return NotFound();
            }

            return Ok(Branchs);
        }

        [HttpPut]
        public ActionResult<BranchModel> UpdateBranch(BranchModel BranchModel)
        {
           var updated = _BranchService.UpdateBranch(BranchModel);
           if (updated == null) return NotFound();
           return Ok(updated);
        }

        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(bool))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteBranch(int BranchId)
        {
            var result = _BranchService.DeleteBranch(BranchId);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

    }
}
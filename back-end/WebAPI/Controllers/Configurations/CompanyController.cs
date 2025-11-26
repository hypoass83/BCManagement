using Domain.InterfacesServices.Configurations;
using Domain.Models.Configurations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using WebAPI.Controllers.Configurations.Requests;

namespace WebAPI.Controllers.Configurations
{
    [ApiController]
    [Route("api/companies")]
    [Authorize]
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyService _companyService;

        public CompanyController(ICompanyService companyService)
        {
            _companyService = companyService;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(CompanyModel))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<CompanyModel>> CreateCompany([FromForm] CompanyRequest request)
        {
            var model = await BuildCompanyModelAsync(request);

            var created = _companyService.Create(model);
            if (created == null)
            {
                return BadRequest();
            }

            return CreatedAtAction(nameof(GetCompanyById), new { companyId = created.CompanyID }, created);
        }

        [HttpGet("{companyId}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CompanyModel))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<CompanyModel> GetCompanyById(int companyId)
        {
            var company = _companyService.GetById(companyId);
            if (company == null)
            {
                return NotFound();
            }

            return Ok(company);
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<CompanyModel>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<List<CompanyModel>> GetAllCompanies()
        {
            var companies = _companyService.GetAll();
            if (companies == null)
            {
                return NotFound();
            }

            return Ok(companies);
        }

        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CompanyModel))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<CompanyModel>> UpdateCompany([FromForm] CompanyRequest request)
        {
            if (!request.CompanyID.HasValue)
            {
                return BadRequest("CompanyID is required for update");
            }

            var model = await BuildCompanyModelAsync(request);
            model.CompanyID = request.CompanyID.Value;

            var updated = _companyService.Update(model);
            if (updated == null)
            {
                return NotFound();
            }

            return Ok(updated);
        }

        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteCompany(int companyId)
        {
            var deleted = _companyService.Delete(companyId);
            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }

        private static async Task<CompanyModel> BuildCompanyModelAsync(CompanyRequest request)
        {
            var model = new CompanyModel
            {
                CompanyID = request.CompanyID ?? 0,
                CompanyCode = request.CompanyCode,
                CompanyName = request.CompanyName,
                CompanyAbbreviation = request.CompanyAbbreviation,
                CompanyDescription = request.CompanyDescription,
                Adress = request.Adress,
                AdressID = request.AdressID 

            };

            if (request.Logo != null && request.Logo.Length > 0)
            {
                using var memoryStream = new MemoryStream();
                await request.Logo.CopyToAsync(memoryStream);
                var base64 = System.Convert.ToBase64String(memoryStream.ToArray());

                model.Archive = new ArchiveModel
                {
                    FileName = request.Logo.FileName,
                    ContentType = request.Logo.ContentType,
                    FileBase64 = base64
                };
            }

            return model;
        }
    }
}


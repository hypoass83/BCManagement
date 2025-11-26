// using Application.Domain;
using Domain.DTO;
using Domain.Models;
using Domain.InterfacesStores.Security;
using Domain.Entities.Configurations;
using Microsoft.AspNetCore.Mvc;
using Domain.InterfacesServices.Security;
using Domain.Models.Security;
using Domain.Models.Localisation;
using Microsoft.AspNetCore.Authorization;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/loclalisation/")]
    [Authorize]
    public class LocalisationController : ControllerBase
    {
        ICountryService _countryService;
        IQuarterService _quarterService;

        ITownService _townService;
        IRegionService _regionService;

        public LocalisationController(ICountryService countryService, IQuarterService quarterService, ITownService townService, IRegionService regionService)
        {
            _countryService = countryService;
            _quarterService = quarterService;
            _townService = townService;
            _regionService = regionService;

        }

        [HttpPost("/create-country")]
        public ActionResult<CountryModel> CreateCountry(CountryModel CountryModel)
        {
            var created = _countryService.Create(CountryModel);
            if (created == null) return BadRequest();
            return CreatedAtAction(nameof(GetCountryById), new { CountryId = created.CountryID }, created);
        }


        [HttpGet("get-country/{CountryId}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<CountryModel> GetCountryById(int CountryId)
        {
            var Country = _countryService.GetById(CountryId);
            if (Country == null)
            {
                return NotFound();
            }

            return Ok(Country);
        }

        [HttpGet("get-all-country")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<CountryModel>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<List<CountryModel>> GetAllCountrys()
        {
            var Countrys = _countryService.GetAll();
            if (Countrys == null)
            {
                return NotFound();
            }

            return Ok(Countrys);
        }

        [HttpPut("update-country")]
        public ActionResult<CountryModel> UpdateCountry(CountryModel CountryModel)
        {
           var updated = _countryService.Update(CountryModel);
           if (updated == null) return NotFound();
           return Ok(updated);
        }

        [HttpDelete("delete-country")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(bool))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteCountry(int CountryId)
        {
            var result = _countryService.Delete(CountryId);

            if (!result)
            {
                return NotFound(); // This will return a 404 status code.
            }

            return NoContent(); // 204 No Content on success
        }

        [HttpPost("/create-region")]
        public ActionResult<RegionModel> CreateRegion(RegionModel RegionModel)
        {
            var created = _regionService.Create(RegionModel);
            if (created == null) return BadRequest();
            return CreatedAtAction(nameof(GetRegionById), new { RegionId = created.RegionID }, created);
        }


        [HttpGet("get-region/{RegionId}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<RegionModel> GetRegionById(int RegionId)
        {
            var Region = _regionService.GetById(RegionId);
            if (Region == null)
            {
                return NotFound();
            }

            return Ok(Region);
        }

        [HttpGet("get-all-region")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<RegionModel>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<List<RegionModel>> GetAllRegions()
        {
            var Regions = _regionService.GetAll();
            if (Regions == null)
            {
                return NotFound();
            }

            return Ok(Regions);
        }

        [HttpPut("update-region")]
        public ActionResult<RegionModel> UpdateRegion(RegionModel RegionModel)
        {
            var updated = _regionService.Update(RegionModel);
            if (updated == null) return NotFound();            
            return Ok(updated);
        }

        [HttpDelete("delete-region")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(bool))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteRegion(int RegionId)
        {
            var result = _regionService.Delete(RegionId);

            if (!result)
            {
                return NotFound(); // This will return a 404 status code.
            }

            return NoContent();
        }


        [HttpPost("/create-town")]
        public ActionResult<TownModel> CreateTown(TownModel TownModel)
        {
            var created = _townService.Create(TownModel);
            if (created == null) return BadRequest();
            return CreatedAtAction(nameof(GetTownById), new { TownId = created.TownID }, created);
        }


        [HttpGet("get-town/{TownId}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<TownModel> GetTownById(int TownId)
        {
            var Town = _townService.GetById(TownId);
            if (Town == null)
            {
                return NotFound();
            }

            return Ok(Town);
        }

        [HttpGet("get-all-town")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<TownModel>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<List<TownModel>> GetAllTowns()
        {
            var Towns = _townService.GetAll();
            if (Towns == null)
            {
                return NotFound();
            }

            return Ok(Towns);
        }

        [HttpPut("update-town")]
        public ActionResult<TownModel> UpdateTown(TownModel TownModel)
        {
            var updated = _townService.Update(TownModel);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("delete-town")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(bool))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteTown(int TownId)
        {
            var result = _townService.Delete(TownId);

            if (!result)
            {
                return NotFound(); // This will return a 404 status code.
            }

            return NoContent();
        }


        [HttpPost("/create-quarter")]
        public ActionResult<QuarterModel> CreateQuarter(QuarterModel QuarterModel)
        {
            var created = _quarterService.Create(QuarterModel);
            if (created == null) return BadRequest();
            return CreatedAtAction(nameof(GetQuarterById), new { QuarterId = created.QuarterID }, created);
        }


        [HttpGet("get-quarter/{QuarterId}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<QuarterModel> GetQuarterById(int QuarterId)
        {
            var Quarter = _quarterService.GetById(QuarterId);
            if (Quarter == null)
            {
                return NotFound();
            }

            return Ok(Quarter);
        }

        [HttpGet("get-all-quarter")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<QuarterModel>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<List<QuarterModel>> GetAllQuarters()
        {
            var Quarters = _quarterService.GetAll();
            if (Quarters == null)
            {
                return NotFound();
            }

            return Ok(Quarters);
        }

        [HttpPut("update-quarter")]
        public ActionResult<QuarterModel> UpdateQuarter(QuarterModel QuarterModel)
        {
            var updated =  _quarterService.Update(QuarterModel);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("delete-quarter")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(bool))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteQuarter(int QuarterId)
        {
            var result = _quarterService.Delete(QuarterId);

            if (!result)
            {
                return NotFound(); // This will return a 404 status code.
            }

            return NoContent(); // 204
        }



    }
}
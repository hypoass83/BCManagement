using Domain.DTO;
using Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Domain.InterfacesServices.Security;
using Domain.Models.Security;
using Microsoft.AspNetCore.Authorization;



namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/profiles/")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        IProfileService _profileService;
        ICurrentUserService _currentUserService;

        public ProfileController(IProfileService profileService,ICurrentUserService currentUserService)
        {
            _profileService = profileService;
            _currentUserService = currentUserService;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ProfileModel))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<ProfileModel> CreateProfile(CreateOrUpdateProfileRequest request)
        {
            var created = _profileService.CreateProfile(request);
            if (created == null) return BadRequest();
            return CreatedAtAction(nameof(GetProfileById), new { id = created.ProfileID }, created);
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<ProfileModel>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<List<ProfileModel>> GetAllProfiles()
        {
            var res = _profileService.GetAllProfile();
            return Ok(res);
        }

        [HttpGet("get-all-profiles-current-user")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<ProfileModel>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<List<ProfileModel>> GetAllProfileById()
        {
            var res = _profileService.GetAllProfileById(this._currentUserService.GetCurentUser().ProfileID??0);
            return Ok(res);
        }

        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ProfileModel))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<ProfileModel> UpdateProfile(CreateOrUpdateProfileRequest request)
        {
            var response = _profileService.UpdateProfile(request);
            if (response == null) return NotFound();
            return Ok(response);
        }

        [HttpDelete("{profileID}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(bool))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteProfile(int profileID)
        {
            var response = _profileService.DeleteProfile(profileID);
            if (!response) return NotFound();
            return NoContent();
        }

        [HttpGet("action-menu-profile")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ActionMenuProfileModel))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<ActionMenuProfileModel> GetActionByPath( string path)
        {
            var res = _profileService.GetActionByPath(this._currentUserService.GetCurentUser().ProfileID??0,path);
            return Ok(res);
        }


        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ProfileModel))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<ProfileModel> GetProfileById(int id)
        {
            var res = _profileService.GetProfileById(id);
            return Ok(res);
        }

        [HttpPut("actions-menu")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(bool))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult UpdateActionModule(UpdateActionModuleRequest req)
        {
            var res = _profileService.UpdateActionModule(req);
            return Ok(res); 
        }

        [HttpGet("module-current-user/")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<ModuleModel>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<List<ModuleModel>> GetModule()
        {
            var res = _profileService.GetModule(this._currentUserService.GetCurentUser().ProfileID??0);
            return Ok(res);
        }

        [HttpGet("module-current-user/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<ModuleModel>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<List<ModuleModel>> GetModuleByProfileID(int id)
        {
            var res = _profileService.GetModule(id);
            return Ok(res);
        }

        [HttpGet("modules")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<ModuleModel>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]

        public ActionResult<List<ModuleModel>> GetAllModules()
        {
            var res = _profileService.GetAllModules();
            return Ok(res);
        }

        [HttpGet("advanced-profile-information/{profileID}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<AdvancedProfileDTO>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<List<AdvancedProfileDTO>> GetAdvancedInformation(int profileID)
        {
            var res = _profileService.GetAdvancedInformation(profileID);
            return Ok(res);
        }
    }
}
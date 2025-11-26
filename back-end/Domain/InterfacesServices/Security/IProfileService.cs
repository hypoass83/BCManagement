using Domain.DTO;
using Domain.Models;
using Domain.Models.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.InterfacesServices.Security
{
    public interface IProfileService
    {
        public ProfileModel CreateProfile(CreateOrUpdateProfileRequest request);
        public ProfileModel UpdateProfile(CreateOrUpdateProfileRequest request);
        public bool DeleteProfile(int profileID);
        public ProfileModel GetProfileById(int id);
        public bool UpdateActionModule(UpdateActionModuleRequest req);
        public List<ModuleModel> GetModule(int profileID);
        public List<ModuleModel> GetAllModules();
        public List<ProfileModel> GetAllProfile();
        public List<ProfileModel> GetAllProfileById(int profileID);
        public ActionMenuProfileModel GetActionByPath(int profileID, string path);
        public List<AdvancedProfileDTO> GetAdvancedInformation(int profileID);

    }
}

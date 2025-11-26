
using System;
using System.Collections.Generic;
using Domain.DTO;
using Domain.Entities.Security;
using Domain.Models.Security;

namespace Domain.InterfacesStores.Security
{
    public interface IProfileStore
    {
        public Profile CreateProfile(Profile profile, List<AssignMenu>? menus, List<AssignSubMenu>? subMenus);
        public Profile UpdateProfile(Profile profile, List<AssignMenu>? menus, List<AssignSubMenu>? subMenus);
        public bool DeleteProfile(int profileID);
        public Profile GetProfileById(int id);
        public bool UpdateActionModule(UpdateActionModuleRequest req);
        public List<Module> GetModule(int profileID);
        public List<Module> GetAllModules();
        public List<Profile> GetAllProfile();
        public List<Profile> GetAllProfileById(int id);
        public ActionMenuProfile GetActionByPath(int profileID, string path);
        public List<AdvancedProfileDTO> GetAdvancedInformation(int profileID);
    }

}

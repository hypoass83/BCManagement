using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Domain.Models;
using Domain.Models.Security;
using Domain.DTO;
using Domain.InterfacesStores.Security;
using Domain.Entities.Configurations;
using Domain.InterfacesServices.Security;
using ProfileEntity = Domain.Entities.Security.Profile;
using ModuleEntity = Domain.Entities.Security.Module;
using ActionMenuProfileEntity = Domain.Entities.Security.ActionMenuProfile;

namespace Application.Service
{
    public class ProfileService : IProfileService
    {
        private readonly IProfileStore _profileStore;
        private readonly IMapper _mapper;

        public ProfileService(IProfileStore profileStore, IMapper mapper)
        {
            _profileStore = profileStore ?? throw new ArgumentNullException(nameof(profileStore));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public ProfileModel CreateProfile(CreateOrUpdateProfileRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));
            var profileEntity = _mapper.Map<ProfileEntity>(request.Profile);
            var created = _profileStore.CreateProfile(profileEntity, request.Menus, request.SubMenus);
            if (created == null) throw new InvalidOperationException("Failed to create profile");
            return _mapper.Map<ProfileModel>(created);
        }

        public ProfileModel UpdateProfile(CreateOrUpdateProfileRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));
            var profileEntity = _mapper.Map<ProfileEntity>(request.Profile);
            var updated = _profileStore.UpdateProfile(profileEntity, request.Menus, request.SubMenus);
            if (updated == null) throw new InvalidOperationException("Failed to update profile");
            return _mapper.Map<ProfileModel>(updated);
        }

        public bool DeleteProfile(int profileID)
        {
            return _profileStore.DeleteProfile(profileID);
        }

        public ProfileModel GetProfileById(int id)
        {
            var profile = _profileStore.GetProfileById(id);
            if (profile == null) throw new KeyNotFoundException($"Profile {id} not found");
            return _mapper.Map<ProfileModel>(profile);
        }

        public bool UpdateActionModule(UpdateActionModuleRequest req)
        {
            return _profileStore.UpdateActionModule(req);
        }

        public List<ModuleModel> GetModule(int profileID)
        {
            var modules = _profileStore.GetModule(profileID) ?? new List<ModuleEntity>();
            return modules.Select(m => _mapper.Map<ModuleModel>(m)).ToList();
        }

        public List<ModuleModel> GetAllModules()
        {
            var modules = _profileStore.GetAllModules() ?? new List<ModuleEntity>();
            return modules.Select(m => _mapper.Map<ModuleModel>(m)).ToList();
        }

        public List<ProfileModel> GetAllProfile()
        {
            var profiles = _profileStore.GetAllProfile() ?? new List<ProfileEntity>();
            return profiles.Select(p => _mapper.Map<ProfileModel>(p)).ToList();
        }

        public List<ProfileModel> GetAllProfileById(int profileID)
        {
            var profiles = _profileStore.GetAllProfileById(profileID) ?? new List<ProfileEntity>();
            return profiles.Select(p => _mapper.Map<ProfileModel>(p)).ToList();
        }

        public ActionMenuProfileModel GetActionByPath(int profileID, string path)
        {
            var action = _profileStore.GetActionByPath(profileID, path);
            if (action == null) throw new KeyNotFoundException($"Action for path '{path}' not found");
            return _mapper.Map<ActionMenuProfileModel>(action);
        }

        public List<AdvancedProfileDTO> GetAdvancedInformation(int profileID)
        {
            return _profileStore.GetAdvancedInformation(profileID) ?? new List<AdvancedProfileDTO>();
        }
    }
}

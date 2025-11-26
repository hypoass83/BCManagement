using System;
using Domain.DTO;
using Domain.InterfacesStores.Security;
using Domain.Entities.Configurations;
using Domain.Models;
using Domain.Models.Security;
using Domain.Entities;
using Infrastructure.Context;
using Domain.Entities.Security;
using Infrastructure.Exceptions;
using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions
;
using System.Collections.Generic;
using System.Diagnostics;

namespace Insfrastructure.Stores
{

    public class ProfileStore : IProfileStore
    { 
        private readonly FsContext _dbContext;

        public ProfileStore(FsContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Profile CreateProfile(Profile profile, List<AssignMenu>? menus, List<AssignSubMenu>? subMenus)
        {
            _dbContext.Profiles.Add(profile);
            _dbContext.SaveChanges();
            if (menus != null) UpdateAssignationMenu(menus, profile.ProfileID);
            if (subMenus != null) UpdateAssignationSubMenu(subMenus, profile.ProfileID);
            return profile;
        }

        public Profile UpdateProfile(Profile profile, List<AssignMenu>? menus, List<AssignSubMenu>? subMenus)
        {
            var existing = _dbContext.Profiles.FirstOrDefault(x => x.ProfileID == profile.ProfileID);
            if (existing == null)
            {
                throw new CustomException("profile not exist", 404);
            }
            _dbContext.Profiles.Entry(existing).CurrentValues.SetValues(profile);
            _dbContext.SaveChanges();
            if (menus != null) UpdateAssignationMenu(menus, existing.ProfileID);
            if (subMenus != null) UpdateAssignationSubMenu(subMenus, existing.ProfileID);
            return existing;
        }

        public bool DeleteProfile(int profileID)
        {
            var pro = _dbContext.Profiles.FirstOrDefault(x => x.ProfileID == profileID);
            if (pro == null)
            {
                return false;
            }
            _dbContext.Profiles.Remove(pro);
            _dbContext.SaveChanges();
            return true;
        }

        public Profile GetProfileById(int id)
        {
            var pro = _dbContext.Profiles.FirstOrDefault(x => x.ProfileID == id);
            if (pro == null)
            {
                throw new CustomException("profile not exist");
            }
            return pro;
        }



        internal void UpdateActionMenu(List<ActionMenuProfileModel> menuactions)
        {
            foreach (var menuitem in menuactions)
            {

                var action = _dbContext.ActionMenuProfiles.FirstOrDefault(x => x.ActionMenuProfileID == menuitem.ActionMenuProfileID);

                if (action == null)
                {
                    throw new CustomException("action not exist", 404);
                }

                action.Update = menuitem.Update;
                action.Add = menuitem.Add;
                action.Delete = menuitem.Remove;

                _dbContext.ActionMenuProfiles.Update(action);
            }


            _dbContext.SaveChanges();
        }

        internal void UpdateActionSubMenu(List<ActionSubMenuProfileModel> submenuactions)
        {
            foreach (var submenuitem in submenuactions)
            {

                var action = _dbContext.ActionSubMenuProfiles.FirstOrDefault(x => x.ActionSubMenuProfileID == submenuitem.ActionSubMenuProfileID);

                if (action == null)
                {
                    throw new CustomException("action not exist", 404);
                }

                action.Update = submenuitem.Update;
                action.Add = submenuitem.Add;
                action.Delete = submenuitem.Remove;

                _dbContext.ActionSubMenuProfiles.Update(action);
            }

            _dbContext.SaveChanges();
        }

        public bool UpdateActionModule(UpdateActionModuleRequest req)
        {

            if (req.Menu.Count > 0)
            {
                UpdateActionMenu(req.Menu);
            }

            if (req.Sub.Count > 0)
            {
                UpdateActionSubMenu(req.Sub);
            }

            return true;


        }

        public List<Module> GetModule(int profileID)
        {
            var menuWithoutSubMenu = _dbContext.ActionMenuProfiles
           .Where(amp => amp.ProfileID == profileID)
           .Select(amp => amp.Menu.Module)
           .Distinct()
           .Include(m => m.Menus)
           .ToList()
           .Select(mod =>
            {
                mod.Menus = mod.Menus.Where(men => men.SubMenus.Count == 0 && men.ActionMenuProfiles.Any(x => x.MenuID == men.MenuID && x.ProfileID == profileID)).ToList();
                return mod;
            })
            .Where(mod => mod.Menus.Count != 0)
            .ToList();

            var menuWithitSubMenu = _dbContext.ActionSubMenuProfiles.AsNoTracking()
            .Where(amp => amp.ProfileID == profileID)
            .Select(amp => amp.SubMenu.Menu.Module)
            .Distinct()
            .Include(m => m.Menus)
            .ToList();

            var menuWithitSubMenuFinal = menuWithitSubMenu
            .Select(mod =>
             {
                 mod.Menus = mod.Menus.Select(men =>
                 {
                     men.SubMenus = men.SubMenus.Where(sub => sub.ActionSubMenuProfiles.Any(act => act.SubMenuID == sub.SubMenuID && act.ProfileID == profileID)).ToList();
                     return men;
                 }).ToList();

                 mod.Menus = mod.Menus.Where(m => m.SubMenus.Count > 0).ToList();

                 return mod;
             })
             .ToList();

            var combinedModules = menuWithitSubMenuFinal.Select(mod =>
            {
                List<Menu> result = [];
                menuWithoutSubMenu.ForEach(mod1 =>
                {
                    if (mod.ModuleID == mod1.ModuleID)
                    {
                        mod1.Menus.ToList().ForEach(X => { result.Add(X); });
                    }
                });
                mod.Menus = mod.Menus.Concat(result).ToList();
                return mod;
            }).ToList();

            //ajouter les elements qui sont uniquement dans menuWithoutSubMenu

            var dd = menuWithoutSubMenu.Select(x => x.ModuleID).Except(combinedModules.Select(x => x.ModuleID).ToList());
            var men = menuWithoutSubMenu.Where(x => dd.Contains(x.ModuleID)).ToList();
            if (men.Count > 0)
            {
                combinedModules.AddRange(men);
            }
            return combinedModules.ToList();
        }

        public List<Module> GetAllModules()
        {
            var modules = _dbContext.Modules
                                    .Include(m => m.Menus)
                                    .Distinct()

                                    .ToList();

            return modules;
        }

        internal void UpdateAssignationMenu(List<AssignMenu> menus, int profileID)
        {
            foreach (var menu in menus)
            {
                if (_dbContext.Menus.FirstOrDefault(x => x.MenuID == menu.MenuID) == null)
                {
                    throw new CustomException("menu not exist", 404);
                }

                if (_dbContext.Profiles.FirstOrDefault(x => x.ProfileID == profileID) == null)
                {
                    throw new CustomException("profile not exist", 404);
                }

                if (menu.Activated)
                {
                    if (_dbContext.ActionMenuProfiles.FirstOrDefault(X => X.MenuID == menu.MenuID && X.ProfileID == profileID) == null)
                    {
                        ActionMenuProfile action = new ActionMenuProfile()
                        {
                            ProfileID = profileID,
                            MenuID = menu.MenuID,

                        };
                        _dbContext.ActionMenuProfiles.Add(action);
                    }
                }
                else
                {
                    var action = _dbContext.ActionMenuProfiles.FirstOrDefault(x => x.MenuID == menu.MenuID && x.ProfileID == profileID);
                    if (action != null)
                    {
                        _dbContext.ActionMenuProfiles.Remove(action);
                    }
                }

            }
            _dbContext.SaveChanges();
        }

        internal void UpdateAssignationSubMenu(List<AssignSubMenu> submenus, int profileID)
        {
            foreach (var submenu in submenus)
            {
                if (_dbContext.SubMenus.FirstOrDefault(x => x.SubMenuID == submenu.SubMenuID) == null)
                {
                    throw new CustomException("menu not exist", 404);
                }

                if (_dbContext.Profiles.FirstOrDefault(x => x.ProfileID == profileID) == null)
                {
                    throw new CustomException("profile not exist", 404);
                }

                if (submenu.Activated)
                {
                    if (_dbContext.ActionSubMenuProfiles.FirstOrDefault(X => X.SubMenuID == submenu.SubMenuID && X.ProfileID == profileID) == null)
                    {
                        ActionSubMenuProfile action = new ActionSubMenuProfile()
                        {
                            ProfileID = profileID,
                            SubMenuID = submenu.SubMenuID,

                        };
                        _dbContext.ActionSubMenuProfiles.Add(action);
                    }
                }
                else
                {
                    var action = _dbContext.ActionSubMenuProfiles.FirstOrDefault(x => x.SubMenuID == submenu.SubMenuID && x.ProfileID == profileID);
                    if (action != null)
                    {
                        _dbContext.ActionSubMenuProfiles.Remove(action);
                    }
                }
            }

            _dbContext.SaveChanges();
        }

        public List<Profile> GetAllProfile()
        {
            return _dbContext.Profiles.ToList();
        }

        public List<Profile> GetAllProfileById(int profileID)
        {
            var profile = _dbContext.Profiles.FirstOrDefault(x => x.ProfileID == profileID);
            if (profile == null) return new List<Profile>();
            return _dbContext.Profiles.Where(x => x.ProfileLevel <= profile.ProfileLevel).ToList();
        }

        public ActionMenuProfile? GetActionByPath(int profileID, string path)
        {
            path = path.Substring(1);
            path = path.Replace("valdoz/", "");
            path = path.Replace("doyoan/", "");
            path = path.Replace("rapha/", "");
            path = path.Replace("nissi/", "");
            path = path.Replace("enject/", "");

            var actionMenu = _dbContext.Menus.FirstOrDefault(men => men.MenuPath.ToLower().Equals(path.ToLower()));
            if (actionMenu != null)
            {
                return actionMenu.ActionMenuProfiles.FirstOrDefault(x => x.ProfileID == profileID);
            }
            else
            {
                var actionSubmenu = _dbContext.SubMenus.FirstOrDefault(sub => sub.SubMenuPath.ToLower().Equals(path.ToLower()));
                if (actionSubmenu != null)
                {
                    var action = actionSubmenu.ActionSubMenuProfiles.FirstOrDefault(x => x.ProfileID == profileID);
                    return new ActionMenuProfile
                    {

                        ActionMenuProfileID = action.ActionSubMenuProfileID,
                        Delete = action.Delete,

                        Add = action.Add,
                        Update = action.Update,
                        MenuID = action.SubMenuID,

                        ProfileID = action.ProfileID,
                    };
                }
                else
                {
                    return null;
                }
            }
        }

        public List<AdvancedProfileDTO> GetAdvancedInformation(int profileID)
        {
            _dbContext.ChangeTracker.LazyLoadingEnabled = false;

            var actionSubMenus = _dbContext.ActionSubMenuProfiles.Where(x => x.ProfileID == profileID).Select(x => x.SubMenuID).ToList();

            var subMenus = _dbContext.SubMenus.Where(x => actionSubMenus.Contains(x.SubMenuID))
                .Include(x => x.ActionSubMenuProfiles)
                .Include(x => x.Menu)
                .ThenInclude(x => x.Module)
                .ToList();

            var res = subMenus.Select(x => new AdvancedProfileDTO
            {
                MenuID = x.SubMenuID,
                ModuleName = x.Menu.Module.ModuleLabel,
                MenuName = x.SubMenuLabel,
                IsSubMenu = true,
                Update = x.ActionSubMenuProfiles.FirstOrDefault(acc => x.SubMenuID == acc.SubMenuID && acc.ProfileID == profileID).Update,
                Add = x.ActionSubMenuProfiles.FirstOrDefault(acc => x.SubMenuID == acc.SubMenuID && acc.ProfileID == profileID).Add,
                Remove = x.ActionSubMenuProfiles.FirstOrDefault(acc => x.SubMenuID == acc.SubMenuID && acc.ProfileID == profileID).Delete,
                ActionMenuProfile = x.ActionSubMenuProfiles.FirstOrDefault(acc => x.SubMenuID == acc.SubMenuID && acc.ProfileID == profileID).ActionSubMenuProfileID,
            }).ToList();


            var actionMenu = _dbContext.ActionMenuProfiles.Where(x => x.ProfileID == profileID).Select(x => x.MenuID).ToList();

            var menus = _dbContext.Menus.Where(x => actionMenu.Contains(x.MenuID))
                .Include(x => x.ActionMenuProfiles)
                .Include(x => x.Module)
                .ToList();

            var res1 = menus.Select(x => new AdvancedProfileDTO
            {
                MenuID = x.MenuID,
                ModuleName = x.Module.ModuleLabel,
                MenuName = x.MenuLabel,
                Update = x.ActionMenuProfiles.FirstOrDefault(acc => x.MenuID == acc.MenuID && acc.ProfileID == profileID).Update,
                Add = x.ActionMenuProfiles.FirstOrDefault(acc => x.MenuID == acc.MenuID && acc.ProfileID == profileID).Add,
                Remove = x.ActionMenuProfiles.FirstOrDefault(acc => x.MenuID == acc.MenuID && acc.ProfileID == profileID).Delete,
                ActionMenuProfile = x.ActionMenuProfiles.FirstOrDefault(acc => x.MenuID == acc.MenuID && acc.ProfileID == profileID).ActionMenuProfileID,
            }).ToList();

            res.AddRange(res1);

            return res;
        }
    }
}

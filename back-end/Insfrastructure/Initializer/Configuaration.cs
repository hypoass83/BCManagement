using System;
using System.Linq;
using System.Collections.Generic;
using Infrastructure.Context;
using Domain.Entities.Security;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Initialiser
{
    public static class ConfigurationInitialiser
    {
        public static void Seed(FsContext context)
        {
            // Seed Modules
            SeedModules(context);
            context.SaveChanges();

            // Seed Menus (inclut la suppression des menus obsolètes)
            SeedMenus(context);
            context.SaveChanges();

            // Seed SubMenus (inclut la suppression des sous-menus obsolètes)
            SeedSubMenus(context);
            context.SaveChanges();

            AssociateAllMenusToDentalUserProfile(context);
            context.SaveChanges();


        }

        private static void SeedModules(FsContext context)
        {
            var modules = new[]
            {
                new { Code = "MODULE_DASHBOARD_ANALYTICS", Label = "Dashboard & Analytics", Desc = "Global dashboards and analytics", Area = "RH", Order = 1 },
                new { Code = "MODULE_ADMINISTRATION", Label = "Administration", Desc = "Security and admin", Area = "Administration", Order = 2 },
                new { Code = "MODULE_CONFIGURATION", Label = "Configuration Système", Desc = "System configuration and parameters", Area = "Administration", Order = 3 }
            };

            var moduleCodesInConfig = modules.Select(m => m.Code).ToHashSet();

            // Supprimer les modules qui ne sont plus dans la configuration
            var modulesToDelete = context.Modules
                .Where(m => !moduleCodesInConfig.Contains(m.ModuleCode))
                .ToList();

            foreach (var moduleToDelete in modulesToDelete)
            {
                // Supprimer d'abord les ActionSubMenuProfiles liés aux SubMenus des Menus de ce module
                var actionSubMenuProfilesToDelete = context.ActionSubMenuProfiles
                    .Where(asmp => asmp.SubMenu != null && asmp.SubMenu.Menu != null && asmp.SubMenu.Menu.ModuleID == moduleToDelete.ModuleID)
                    .ToList();
                context.ActionSubMenuProfiles.RemoveRange(actionSubMenuProfilesToDelete);

                // Supprimer les SubMenus liés aux Menus de ce module
                var subMenusToDelete = context.SubMenus
                    .Where(sm => sm.Menu != null && sm.Menu.ModuleID == moduleToDelete.ModuleID)
                    .ToList();
                context.SubMenus.RemoveRange(subMenusToDelete);

                // Supprimer les ActionMenuProfiles liés aux Menus de ce module
                var actionMenuProfilesToDelete = context.ActionMenuProfiles
                    .Where(amp => amp.Menu.ModuleID == moduleToDelete.ModuleID)
                    .ToList();
                context.ActionMenuProfiles.RemoveRange(actionMenuProfilesToDelete);

                // Supprimer les Menus de ce module
                var menusToDelete = context.Menus
                    .Where(m => m.ModuleID == moduleToDelete.ModuleID)
                    .ToList();
                context.Menus.RemoveRange(menusToDelete);

                // Enfin, supprimer le module
                context.Modules.Remove(moduleToDelete);
            }

            foreach (var mod in modules)
            {
                var existing = context.Modules.FirstOrDefault(m => m.ModuleCode == mod.Code);
                if (existing == null)
                {
                    var module = new Module
                    {
                        ModuleCode = mod.Code,
                        ModuleLabel = mod.Label,
                        ModuleDescription = mod.Desc,
                        ModuleArea = mod.Area,
                        ModuleState = true,
                        AppearanceOrder = mod.Order,
                        ModuleImagePath = $"MOD_IMG_{mod.Code}",
                        ModulePressedImagePath = $"MOD_PRESSED_IMG_{mod.Code}",
                        ModuleDisabledImagePath = $"MOD_DISABLED_IMG_{mod.Code}"
                    };
                    context.Modules.Add(module);
                }
                else
                {
                    // Mettre à jour les propriétés du module existant
                    existing.ModuleLabel = mod.Label;
                    existing.ModuleDescription = mod.Desc;
                    existing.ModuleArea = mod.Area;
                    existing.AppearanceOrder = mod.Order;
                }
            }
        }

        private static void SeedMenus(FsContext context)
        {
            var menus = new[]
            {
                // DASHBOARD & ANALYTICS
                new { Code = "DASHBOARD_GLOBAL", Label = "Global Dashboard", Controller = "Dashboard", Path = "dashboard/global", ModuleCode = "MODULE_DASHBOARD_ANALYTICS" },

               
                // ADMINISTRATION
                new { Code = "ADMIN_PROFILE", Label = "Profile", Controller = "Profile", Path = "admin/profile", ModuleCode = "MODULE_ADMINISTRATION" },
                new { Code = "ADMIN_USERS", Label = "Users", Controller = "User", Path = "admin/users", ModuleCode = "MODULE_ADMINISTRATION" },

                // CONFIGURATION SYSTEM
                new { Code = "CONFIG_COMPANY", Label = "Company", Controller = "Company", Path = "config/company", ModuleCode = "MODULE_CONFIGURATION" },
            
            };

            var menuCodesInConfig = menus.Select(m => m.Code).ToHashSet();

            // Supprimer les menus qui ne sont plus dans la configuration
            var menusToDelete = context.Menus
                .Where(m => !menuCodesInConfig.Contains(m.MenuCode))
                .ToList();

            foreach (var menuToDelete in menusToDelete)
            {
                // Supprimer d'abord les ActionSubMenuProfiles liés aux SubMenus de ce menu
                var actionSubMenuProfilesToDelete = context.ActionSubMenuProfiles
                    .Where(asmp => asmp.SubMenu.MenuID == menuToDelete.MenuID)
                    .ToList();
                context.ActionSubMenuProfiles.RemoveRange(actionSubMenuProfilesToDelete);

                // Supprimer les SubMenus de ce menu
                var subMenusToDelete = context.SubMenus
                    .Where(sm => sm.MenuID == menuToDelete.MenuID)
                    .ToList();
                context.SubMenus.RemoveRange(subMenusToDelete);

                // Supprimer les ActionMenuProfiles liés à ce menu
                var actionMenuProfilesToDelete = context.ActionMenuProfiles
                    .Where(amp => amp.MenuID == menuToDelete.MenuID)
                    .ToList();
                context.ActionMenuProfiles.RemoveRange(actionMenuProfilesToDelete);

                // Supprimer le menu
                context.Menus.Remove(menuToDelete);
            }

            foreach (var menu in menus)
            {
                var existing = context.Menus.FirstOrDefault(m => m.MenuCode == menu.Code);
                if (existing == null)
                {
                    var module = context.Modules.FirstOrDefault(m => m.ModuleCode == menu.ModuleCode);
                    if (module != null)
                    {
                        var newMenu = new Menu
                        {
                            MenuCode = menu.Code,
                            MenuLabel = menu.Label,
                            MenuController = menu.Controller,
                            MenuPath = menu.Path,
                            MenuDescription = menu.Label,
                            MenuFlat = true,
                            MenuState = true,
                            ModuleID = module.ModuleID,
                            MenuIconName = $"{menu.Code}.png"
                        };
                        context.Menus.Add(newMenu);
                    }
                }
                else
                {
                    // Mettre à jour les propriétés du menu existant
                    existing.MenuLabel = menu.Label;
                    existing.MenuController = menu.Controller;
                    existing.MenuPath = menu.Path;
                    existing.MenuDescription = menu.Label;
                }
            }
        }

        private static void SeedSubMenus(FsContext context)
        {
            var subMenus = new[]
            {
                
                // ADMINISTRATION -> Profile subs
                new { Code = "PROFILE_ADVANCED", Label = "Advance Profile", Controller = "Profile", Path = "admin/profile/advanced", MenuCode = "ADMIN_PROFILE", Order = 1 },
                new { Code = "PROFILE_BASE", Label = "Profile", Controller = "Profile", Path = "admin/profile/base", MenuCode = "ADMIN_PROFILE", Order = 2 },

                // CONFIGURATION -> Company
                new { Code = "COMPANIES", Label = "Companies", Controller = "Company", Path = "config/company/companies", MenuCode = "CONFIG_COMPANY", Order = 1 },
                new { Code = "AGENCIES", Label = "Agencies", Controller = "Company", Path = "config/company/agencies", MenuCode = "CONFIG_COMPANY", Order = 2 },
                new { Code = "JOBS", Label = "Jobs", Controller = "Company", Path = "config/company/jobs", MenuCode = "CONFIG_COMPANY", Order = 3 },

                // CONFIGURATION -> Locality
                new { Code = "COUNTRY", Label = "Country", Controller = "Locality", Path = "config/locality/country", MenuCode = "CONFIG_LOCALITY", Order = 1 },
                new { Code = "REGION", Label = "Region", Controller = "Locality", Path = "config/locality/region", MenuCode = "CONFIG_LOCALITY", Order = 2 },
                new { Code = "TOWN", Label = "Town", Controller = "Locality", Path = "config/locality/town", MenuCode = "CONFIG_LOCALITY", Order = 3 },
                new { Code = "QUARTER", Label = "Quarter", Controller = "Locality", Path = "config/locality/quarter", MenuCode = "CONFIG_LOCALITY", Order = 4 },

            };

            var subMenuCodesInConfig = subMenus.Select(sm => sm.Code).ToHashSet();

            // Supprimer les sous-menus qui ne sont plus dans la configuration
            var subMenusToDelete = context.SubMenus
                .Where(sm => !subMenuCodesInConfig.Contains(sm.SubMenuCode))
                .ToList();

            foreach (var subMenuToDelete in subMenusToDelete)
            {
                // Supprimer d'abord les ActionSubMenuProfiles liés à ce sous-menu
                var actionSubMenuProfilesToDelete = context.ActionSubMenuProfiles
                    .Where(asmp => asmp.SubMenuID == subMenuToDelete.SubMenuID)
                    .ToList();
                context.ActionSubMenuProfiles.RemoveRange(actionSubMenuProfilesToDelete);

                // Supprimer le sous-menu
                context.SubMenus.Remove(subMenuToDelete);
            }

            foreach (var subMenu in subMenus)
            {
                var existing = context.SubMenus.FirstOrDefault(sm => sm.SubMenuCode == subMenu.Code);
                if (existing == null)
                {
                    var menu = context.Menus.FirstOrDefault(m => m.MenuCode == subMenu.MenuCode);
                    if (menu != null)
                    {
                        var newSubMenu = new SubMenu
                        {
                            SubMenuCode = subMenu.Code,
                            SubMenuLabel = subMenu.Label,
                            SubMenuController = subMenu.Controller,
                            SubMenuPath = subMenu.Path,
                            SubMenuDescription = subMenu.Label,
                            MenuID = menu.MenuID,
                            AppearanceOrder = subMenu.Order,
                            SubMenuState = true,
                            IsChortcut = true
                        };
                        context.SubMenus.Add(newSubMenu);
                    }
                }
                else
                {
                    // Mettre à jour les propriétés du sous-menu existant
                    existing.SubMenuLabel = subMenu.Label;
                    existing.SubMenuController = subMenu.Controller;
                    existing.SubMenuPath = subMenu.Path;
                    existing.SubMenuDescription = subMenu.Label;
                    existing.AppearanceOrder = subMenu.Order;
                }
            }
        }



        private static void AssociateAllMenusToDentalUserProfile(FsContext context)
        {
            // Récupérer l'utilisateur dental
            var dentalUser = context.Users.FirstOrDefault(u => u.UserLogin == "dental");
            if (dentalUser == null)
            {
                throw new InvalidOperationException("L'utilisateur 'dental' n'existe pas dans la base de données.");
            }

            // Récupérer le profil de l'utilisateur dental
            var dentalProfile = context.Profiles.FirstOrDefault(p => p.ProfileID == dentalUser.ProfileID);
            if (dentalProfile == null)
            {
                throw new InvalidOperationException($"Le profil avec l'ID {dentalUser.ProfileID} n'existe pas.");
            }

            // Récupérer tous les menus actifs
            var allMenus = context.Menus.Where(m => m.MenuState).ToList();

            // Récupérer tous les sous-menus actifs
            var allSubMenus = context.SubMenus.Where(sm => sm.SubMenuState).ToList();

            // Associer tous les menus au profil dental
            foreach (var menu in allMenus)
            {
                var existingActionMenuProfile = context.ActionMenuProfiles
                    .FirstOrDefault(amp => amp.MenuID == menu.MenuID && amp.ProfileID == dentalProfile.ProfileID);

                if (existingActionMenuProfile == null)
                {
                    var actionMenuProfile = new ActionMenuProfile
                    {
                        MenuID = menu.MenuID,
                        ProfileID = dentalProfile.ProfileID,
                        Delete = true,
                        Add = true,
                        Update = true,
                    };
                    context.ActionMenuProfiles.Add(actionMenuProfile);
                }
                else
                {
                    existingActionMenuProfile.Delete = true;
                    existingActionMenuProfile.Add = true;
                    existingActionMenuProfile.Update = true;

                }
            }

            // Associer tous les sous-menus au profil dental
            foreach (var subMenu in allSubMenus)
            {
                var existingActionSubMenuProfile = context.ActionSubMenuProfiles
                    .FirstOrDefault(asmp => asmp.SubMenuID == subMenu.SubMenuID && asmp.ProfileID == dentalProfile.ProfileID);

                if (existingActionSubMenuProfile == null)
                {
                    var actionSubMenuProfile = new ActionSubMenuProfile
                    {
                        SubMenuID = subMenu.SubMenuID,
                        ProfileID = dentalProfile.ProfileID,

                        Delete = true,
                        Add = true,
                        Update = true,

                    };
                    context.ActionSubMenuProfiles.Add(actionSubMenuProfile);
                }
                else
                {

                    existingActionSubMenuProfile.Add = true;
                    existingActionSubMenuProfile.Delete = true;
                    existingActionSubMenuProfile.Update = true;

                }
            }
        }
    }

}


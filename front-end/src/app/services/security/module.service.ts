import { catchError, of, throwError } from 'rxjs';
import { MenuModel, ModuleModel, ProfileService } from '../../generated';
import { effect, Injectable, signal } from '@angular/core';
import { AuthService } from '../auth.service';
import { Menu } from 'src/app/shared/services/navservice';

@Injectable()
export default class SecurityModuleService {
  UserModuleList = signal<Menu[]>([]);

  UserModules =  signal<ModuleModel[]>([]);
  AllModules =  signal<ModuleModel[]>([]);

  constructor(
    private profileService: ProfileService,
    private auth: AuthService
  ) {
      this.getUserModules()
    effect(() => {
    }, { allowSignalWrites: true });
  }

  getUserModules() {
    const profileID = this.auth.getUser()?.profileID;
    if (profileID) {
      this.profileService.profileControllerGetModule()
        .pipe(
          catchError((error) => {
            return throwError(() => new Error('Failed to get module', error));
          })
        )
        .subscribe((modules) =>{
          modules = modules.sort((a,b)=>Number(a.appearanceOrder)-Number(b.appearanceOrder))
          modules = modules.map(mod=>{ return {...mod,menus:mod.menus?.sort((a,b)=>Number(a.subMenus?.length)-Number(b.subMenus?.length))}})
          modules = modules.map(mod=>{ return {...mod,menus:mod.menus?.sort((a,b)=>Number(a?.appearanceOrder)-Number(b?.appearanceOrder))}})
          modules = modules.map(mod=>{ return {...mod,menus:mod.menus?.map(sub=>{return {...sub,subMenus:sub.subMenus?.sort((a,b)=>Number(a?.appearanceOrder)-Number(b?.appearanceOrder))}})}})
          this.UserModuleList.set(this.convertModulesToMenus(modules))
          this.UserModules.set(modules)

        })
    }
  }

  updateAllModule() {

    this.profileService.profileControllerGetAllModules()
      .pipe(
        catchError((error) => {
          return throwError(() => new Error('Failed to get modules', error));
        })
      )
      .subscribe((modules) =>{
        this.AllModules.update(()=>[...modules]);
      });
  }

  convertModulesToMenus(modules: ModuleModel[]): Menu[] {
    let men = modules.map(
      (module) =>
        <Menu>{
          title: module.moduleCode,
          icon: module.menuIconName ?? 'home-8-line',
          type: 'sub',
          active: false,
          id:module.moduleID,
          selected: false,
          children:
            module.menus?.map((menuModel) =>
              this.convertMenuModelToMenu(menuModel)
            ) || [],
        }
    );
    return men;
  }

  convertMenuModelToMenu(menuModel: MenuModel) {
    const isFlat = menuModel.subMenus?.length && menuModel.subMenus.length>0
    return {
      path: menuModel.menuPath,
      id:menuModel.menuID,
      title: menuModel.menuCode,
      type: (menuModel.subMenus?.length && menuModel.subMenus.length>0) ? 'sub' : 'link',
      selected: false,
      Menusub: (isFlat)?true:false,
      active: false,
      children: (isFlat)?menuModel.subMenus?.map((sub) => {
            return {
              path: sub.subMenuPath,
              title: sub.subMenuCode,
              type: 'link',
              id:sub.subMenuID
            };
          })
        : [],
    };
  }

}

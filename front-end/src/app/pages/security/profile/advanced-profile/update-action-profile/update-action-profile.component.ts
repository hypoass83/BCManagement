import { Component, effect, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  ActionMenuProfileModel,
  ActionSubMenuProfileModel,
  AdvancedProfileDTO,
  ModuleModel,
  ProfileService,
  SubMenuModel,
} from 'src/app/generated';
import { UpdateActionModuleRequest } from 'src/app/generated/model/updateActionModuleRequest';
import SecurityModuleService from 'src/app/services/security/module.service';
import SecurityProfileService from 'src/app/services/security/profile.service';

@Component({
  selector: 'app-update-action-profile',
  templateUrl: './update-action-profile.component.html',
  styleUrls: ['./update-action-profile.component.scss'],
})
export class UpdateActionProfileComponent {
  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private router: Router
  ) {}
  modules: ModuleModel[] = [];
  AllActionMenu: ActionMenuProfileModel[] = [];
  AllSubActionMenu: ActionSubMenuProfileModel[] = [];
  profileID = this.route.snapshot.params['id'];

  async ngOnInit() {
    let t = await firstValueFrom(
      this.profileService.profileControllerGetAdvancedInformation(
        this.profileID
      )
    );

    this.AllActionMenu = t
      .filter((x) => !x.isSubMenu)
      .map((x) => {
        return {
          actionMenuProfileID: x.actionMenuProfile,
          remove: x.remove,
          update: x.update,
          add: x.add,
          profileID: this.profileID,
        };
      });

    this.AllSubActionMenu = t
      .filter((x) => x.isSubMenu)
      .map((x) => {
        return {
          actionSubMenuProfileID: x.actionMenuProfile,
          remove: x.remove,
          update: x.update,
          add: x.add,
          profileID: this.profileID,
        };
      });

    this.groupedModules = this.groupByModuleAndMenu(t);
  }

  onCheckboxChange(
    event: Event,
    isSubMenu: boolean | undefined,
    actionMenuID: number | undefined,
    action: string
  ) {
    const input = event.target as HTMLInputElement;
    const isChecked = input.checked;

    if (!isSubMenu) {
      const check = this.actionMenuList.some(
        (e) => e.actionMenuProfileID == actionMenuID
      );
      if (check) {
        this.actionMenuList = this.actionMenuList.map((act) => ({
          ...act,
          remove: action == 'remove' ? isChecked : act.remove,
          update: action == 'update' ? isChecked : act.update,
          add: action == 'add' ? isChecked : act.add,
        }));
      } else {
        const actionMenu = this.AllActionMenu.find(
          (act) => act.actionMenuProfileID == actionMenuID
        );
        this.actionMenuList.push({
          ...actionMenu,
          remove: action == 'remove' ? isChecked : actionMenu?.remove,
          update: action == 'update' ? isChecked : actionMenu?.update,
          add: action == 'add' ? isChecked : actionMenu?.add,
        });
      }
    } else {
      const check = this.actionSubMenuLIst.some(
        (e) => e.actionSubMenuProfileID == actionMenuID
      );
      if (check) {
        this.actionSubMenuLIst = this.actionSubMenuLIst.map((act) => ({
          ...act,
          remove: action == 'remove' ? isChecked : act.remove,
          update: action == 'update' ? isChecked : act.update,
          add: action == 'add' ? isChecked : act.add,
        }));
      } else {
        const actionMenu = this.AllSubActionMenu.find(
          (act) => act.actionSubMenuProfileID == actionMenuID
        );
        this.actionSubMenuLIst.push({
          ...actionMenu,
          remove: action == 'remove' ? isChecked : actionMenu?.remove,
          update: action == 'update' ? isChecked : actionMenu?.update,
          add: action == 'add' ? isChecked : actionMenu?.add,
        });
      }
    }

  }

  actionMenuList: ActionMenuProfileModel[] = [];
  actionSubMenuLIst: ActionSubMenuProfileModel[] = [];

  saveAll() {
    const request: UpdateActionModuleRequest = {
      menu: this.actionMenuList,
      sub: this.actionSubMenuLIst,
    };
    this.profileService
      .profileControllerUpdateActionModule(request)
      .subscribe(() => {
        this.router.navigate(['/admin/profile/advanced']);
      });
  }

  groupedModules: Record<string, Record<string, AdvancedProfileDTO[]>> = {};

  groupByModuleAndMenu(data: AdvancedProfileDTO[]) {
    return data.reduce((acc, item) => {
      if (!item.moduleName) return acc;

      if (!acc[item.moduleName]) {
        acc[item.moduleName] = {};
      }

      if (!acc[item.moduleName][item.menuName || '']) {
        acc[item.moduleName][item.menuName || ''] = [];
      }

      acc[item.moduleName][item.menuName || ''].push(item);

      return acc;
    }, {} as Record<string, Record<string, AdvancedProfileDTO[]>>);
  }

  getSubMenuModule(moduleName: string, menuName: string) {
    return this.groupedModules[moduleName]?.[menuName] || [];
  }
}

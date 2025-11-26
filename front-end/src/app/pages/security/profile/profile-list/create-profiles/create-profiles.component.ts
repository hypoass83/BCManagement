import {
  ActionMenuProfileModel,
  ActionSubMenuProfileModel,
  AssignMenu,
  AssignSubMenu,
  CreateOrUpdateProfileRequest,
  MenuModel,
  ModuleModel,
  ProfileModel,
  SubMenuModel,
} from 'src/app/generated';
import { Component, effect, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import SecurityProfileService from 'src/app/services/security/profile.service';
import SecurityModuleService from 'src/app/services/security/module.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-profiles',
  templateUrl: './create-profiles.component.html',
  styleUrls: ['./create-profiles.component.scss'],
})
export class CreateProfilesComponent implements OnInit {
  profileID = this.route.snapshot.params['id'];

  modules: ModuleModel[] = [];
  userModules: ModuleModel[] = [];
  activeTabIndex = 0;

  public ProfileForm!: FormGroup;

  profile: ProfileModel | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private profileService: SecurityProfileService,
    private moduleService: SecurityModuleService,
    private route: ActivatedRoute
  ) {
    effect(
      () => {
        this.loadProfile();
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit() {
    this.initializeForm();
    this.profileService.getProfileList();
    this.loadProfile();
    this.modules = this.filterModules(this.moduleService.AllModules());
  }

  filterModules(modules: ModuleModel[]) {
    const t = modules.map<ModuleModel>((mod) => {
      const menusWithoutSubMenus =
        mod.menus?.filter(
          (menu) => !menu.subMenus || menu.subMenus.length === 0
        ) ?? [];

      const othersMenu =
        menusWithoutSubMenus.length > 0
          ? {
              menuLabel: 'Others',
              subMenus: menusWithoutSubMenus.map((menu) => ({
                subMenuID: menu.menuID,
                subMenuLabel: menu.menuLabel,
                subMenuState: menu.actionMenuProfiles?.some(
                  (e) => e.profileID == this.profileID
                ),
              })),
            }
          : null;
      let menusWithSubMenus =
        mod.menus?.filter(
          (menu) => menu.subMenus && menu.subMenus.length > 0
        ) ?? [];

      menusWithSubMenus = menusWithSubMenus.map((m) => ({
        ...m,
        subMenus: m.subMenus?.map((sub) => ({
          ...sub,
          subMenuState: sub.actionSubMenuProfiles?.some(
            (a) => a.profileID == this.profileID
          ),
        })),
      }));

      const updatedMenus = othersMenu
        ? [...menusWithSubMenus, othersMenu]
        : menusWithSubMenus;

      const result = {
        ...mod,
        menus: updatedMenus,
      };

      return result;
    });

    return t;
  }

  setActiveTab(index: number) {
    this.activeTabIndex = index;
  }
  Submit() {
    if (this.ProfileForm.valid) {
      const profile: ProfileModel = this.ProfileForm.value;
      const request: CreateOrUpdateProfileRequest = {
        menus: this.assignMenu,
        subMenus: this.assignSubMenu,
        profile: profile,
      };
      this.profileService.createOrUpdateProfile(request);
    }
  }

  loadProfile() {
    this.profile = this.profileService
      .profileList()
      .find((p) => p.profileID == this.profileID);
    if (this.profile) {
      this.updateForm();
    } else {
      this.profileID = 0;
    }
  }

  updateForm() {
    if (this.profile) {
      this.ProfileForm.patchValue({
        profileLabel: this.profile.profileLabel,
        profileCode: this.profile.profileCode,
        profileDescription: this.profile.profileDescription,
        profileLevel: this.profile.profileLevel,
        profileState: this.profile.profileState,
        profileID: this.profile.profileID,
      });
    }
  }

  initializeForm() {
    this.ProfileForm = this.formBuilder.group({
      profileLabel: ['', Validators.required],
      profileCode: ['', Validators.required],
      profileDescription: ['', Validators.required],
      profileLevel: [3, [Validators.required]],
      profileState: [true, Validators.required],
      profileID: [0, Validators.required],
    });
  }
  onCheckboxChangeAll(event: Event) {
    this.assignMenu = [];
    this.assignSubMenu = [];
    const input = event.target as HTMLInputElement;
    this.modules.forEach((mod) => {
      mod.menus?.forEach((men) => {
        // this.onCheckboxChange(event,men.menuID??0,men.menuLabel??"")
        men.subMenus?.forEach((sub) => {
          this.mangeChecBox(
            men.menuLabel ?? '',
            Number(sub.subMenuID),
            input.checked
          );
          this.onCheckboxChange(event, sub.subMenuID ?? 0, men.menuLabel ?? '');
        });
      });
    });
  }

  mangeChecBox(menuLabel: string, id: number, checked: boolean) {
    let checkbox;
    if (menuLabel == 'Others') {
      checkbox = document.getElementById(
        'men-checkbox-group-' + id
      ) as HTMLInputElement;
    } else {
      checkbox = document.getElementById(
        'sub-checkbox-group-' + id
      ) as HTMLInputElement;
    }
    if (checkbox) {
      checkbox.checked = checked;
    }
  }

  onCheckboxMenu(event: Event, menuModel: string, subMenus: SubMenuModel[]) {
    const input = event.target as HTMLInputElement;
    const isChecked = input.checked;
    subMenus.forEach((sub) => {
      this.mangeChecBox(menuModel,Number(sub.subMenuID),isChecked)
      this.onCheckboxChange(event,Number(sub.subMenuID),menuModel)
    });
  }
  onCheckboxChange(event: Event, subMenuID: number, menuLabel: string) {
    const input = event.target as HTMLInputElement;
    const isChecked = input.checked;
    if (menuLabel != 'Others') {
      const check = this.assignSubMenu.some((e) => e.subMenuID == subMenuID);
      if (check) {
        this.assignSubMenu = this.assignSubMenu.filter(
          (e) => e.subMenuID != subMenuID
        );
      } else {
        this.assignSubMenu.push({
          subMenuID: subMenuID,
          activated: input.checked,
        });
      }
    } else {
      const check = this.assignMenu.some((e) => e.menuID == subMenuID);
      if (check) {
        this.assignMenu = this.assignMenu.filter((e) => e.menuID != subMenuID);
      } else {
        this.assignMenu.push({ menuID: subMenuID, activated: input.checked });
      }
    }
  }

  assignMenu: AssignMenu[] = [];
  assignSubMenu: AssignSubMenu[] = [];
}

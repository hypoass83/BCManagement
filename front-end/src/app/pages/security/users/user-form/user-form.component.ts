import { UserManagerService } from 'src/app/services/security/user.service';

import { UserCreateDTO } from './../../../../generated/model/userCreateDTO';
import { ProfileService } from './../../../../generated/api/profile.service';
import { JobService } from './../../../../generated/api/job.service';
import { LocalisationService } from './../../../../generated/api/localisation.service';
import { CountryModel } from './../../../../generated/model/countryModel';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchModel, JobModel, ProfileModel, QuarterModel, RegionModel, TownModel, UserModel, BranchService } from 'src/app/generated';
import { firstValueFrom } from 'rxjs';
import { GridApi } from 'ag-grid-community';
import { closeModal } from 'src/app/helper/helper-function';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';



@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UsersFormComponent implements OnInit, OnChanges {


  @Input() userToUpdate: UserModel | null = null;

  public userForm!: FormGroup;
  public error = "";
  countries: CountryModel[] = [];
  allRegions: RegionModel[] = [];
  allTowns: TownModel[] = [];
  allQuarters: QuarterModel[] = [];
  regions: RegionModel[] = [];
  towns: TownModel[] = [];
  quarters: QuarterModel[] = [];
  profiles: ProfileModel[] = [];
  jobs: JobModel[] = [];
  branchs: BranchModel[] = [];

  isSubmitted = false;

  constructor( private formBuilder: FormBuilder, private localisationService: LocalisationService, private jobService: JobService, private profileService: ProfileService,
private theme:AgGridThemeService, private userService: UserManagerService,private branchService: BranchService) {
    this.initCreateForm();
  }

  ngOnChanges(): void {

    if (this.userToUpdate) {
      const quater = this.userToUpdate.adress?.quarter
      if (quater) {
        this.filterRegions(quater.town?.region?.countryID ?? 0);
        this.filterTowns(quater.town?.regionID ?? 0);
        this.filterQuarters(quater.townID ?? 0);
      }
      this.initEditForm(this.userToUpdate)

    } else {
      this.initCreateForm();
    }

   this.addEventListerneToQuarterSearch()

   this.addValidatorWhenItComesToACOmpleteUser()



  }


  async ngOnInit() {
    try {
      this.countries = await firstValueFrom(this.localisationService.localisationControllerGetAllCountrys());
      this.allTowns = await firstValueFrom(this.localisationService.localisationControllerGetAllTowns());
      this.allRegions = await firstValueFrom(this.localisationService.localisationControllerGetAllRegions());
      this.allQuarters = await firstValueFrom(this.localisationService.localisationControllerGetAllQuarters());
      this.jobs = await firstValueFrom(this.jobService.jobControllerGetAllJobs());
      this.profiles = await firstValueFrom(this.profileService.profileControllerGetAllProfiles());
      this.branchs = await firstValueFrom(this.branchService.branchControllerGetAllBranchs());
    } catch (err) {
    }
  }

  get form() {
    return this.userForm.controls;
  }

  createOrUpdateUSer() {

    this.isSubmitted = true;
    if (this.userForm.valid) {
      const userCreateDTO: UserCreateDTO = {
        globalPersonID: this.userToUpdate?.globalPersonID,
        userLogin: this.form['userLogin'].value,
        userAccessLevel: this.form['userAccessLevel'].value,
        userAccountState: this.form['userAccountState'].value,
        jobID: this.form['jobID'].value,
        adress: this.form['adress'].value,
        name: this.form['name'].value,
        description: this.form['description'].value,
        cni: this.form['cni'].value,
        profileID: this.form['profileID'].value,
        sexID: this.form['sexID'].value,
        isConnected: this.form['isConnected'].value,
        isMarketer: this.form['isMarketer'].value,
        isSeller: this.form['isSeller'].value,
        branchID : this.form['branchID'].value
      }
      if (this.userToUpdate) {
        this.userService.updateUser(userCreateDTO);
      } else {
        this.userService.addUser(userCreateDTO);
      }

      this.isSubmitted = false;

    }


  }

  addEventListerneToQuarterSearch(){
    this.userForm.get('adress.countryID')?.valueChanges.subscribe(countryId => {
      this.filterRegions(countryId);
    });
    this.userForm.get('adress.regionID')?.valueChanges.subscribe(regionId => {
      this.filterTowns(regionId);
    });

    this.userForm.get('adress.townID')?.valueChanges.subscribe(townId => {
      this.filterQuarters(townId);
    });
  }

  addValidatorWhenItComesToACOmpleteUser(){

    this.userForm.get('isConnected')?.valueChanges.subscribe(isConnected => {
      if (isConnected) {
        this.userForm.get('userLogin')?.setValidators([Validators.required]);
        this.userForm.get('profileID')?.setValidators([Validators.required]);
      } else {
        this.userForm.get('userLogin')?.clearValidators();
        this.userForm.get('profileID')?.clearValidators();
        this.userForm.get('userLogin')?.reset();
        this.userForm.get('profileID')?.reset();
      }
      this.userForm.get('userLogin')?.updateValueAndValidity();
      this.userForm.get('profileID')?.updateValueAndValidity();
    });
  }



  filterRegions(countryId: number) {
    this.regions = this.allRegions.filter(region => region.countryID === countryId);
    this.userForm.get('adress.regionID')?.reset();
    this.userForm.get('adress.regionID')?.enable();
    this.userForm.get('adress.regionID')?.patchValue(null);
    // Reset and disable dependent fields
    this.userForm.get('adress.townID')?.reset();
    this.userForm.get('adress.townID')?.disable();
    this.userForm.get('adress.quarterID')?.reset();
    this.userForm.get('adress.quarterID')?.disable();
  }

  filterTowns(regionId: number) {
    this.towns = this.allTowns.filter(town => town.regionID === regionId);
    this.userForm.get('adress.townID')?.reset();
    this.userForm.get('adress.townID')?.enable();
    this.userForm.get('adress.townID')?.patchValue(null);

    // Reset and disable dependent field
    this.userForm.get('adress.quarterID')?.reset();
    this.userForm.get('adress.quarterID')?.disable();
  }

  filterQuarters(townId: number) {
    this.quarters = this.allQuarters.filter(quarter => quarter.townID === townId);
    this.userForm.get('adress.quarterID')?.reset();
    this.userForm.get('adress.quarterID')?.enable();
    this.userForm.get('adress.quarterID')?.patchValue(null);
  }

  initCreateForm() {
    this.userForm = this.formBuilder.group({

      globalPersonID: [null],
      code: [null],
      userLogin: [null],
      userAccessLevel: [1],
      userAccountState: [true],
      jobID: [null, Validators.required],
      adress: this.formBuilder.group({
        adressPhoneNumber: [null, Validators.required],
        adressCellNumber: [null],
        adressFullName: [null],
        adressEmail: [null, Validators.email],
        adressWebSite: [null],
        adressPOBox: [null],
        adressFax: [null],
        countryID: [null],
        regionID: [{ value: null, disabled: true }],
        townID: [{ value: null, disabled: true }],
        quarterID: [{ value: null, disabled: true }]
      }),
      name: [null, Validators.required],
      tiergroup: [null],
      description: [null, Validators.required],
      cni: [null, Validators.required],
      profileID: [null],
      sexID: [1, Validators.required],
      isConnected: [false],
      isMarketer: [true],
      isSeller: [true],
      branchID: [null, Validators.required]
    });
  }


  initEditForm(user: UserModel) {
    this.userForm = this.formBuilder.group({
      globalPersonID: [user.adressID],
      code: [user.code],
      userLogin: [ { value: user.userLogin, disabled: true }],
      userAccessLevel: [user.userAccessLevel],
      userAccountState: [user.userAccountState],
      jobID: [user.jobID, Validators.required],
      adress: this.formBuilder.group({
        adressID: [user.adress?.adressID],
        adressPhoneNumber: [user.adress?.adressPhoneNumber, Validators.required],
        adressCellNumber: [user.adress?.adressCellNumber],
        adressFullName: [user.adress?.adressFullName],
        adressEmail: [user.adress?.adressEmail, Validators.email],
        adressWebSite: [user.adress?.adressWebSite],
        adressPOBox: [user.adress?.adressPOBox],
        adressFax: [user.adress?.adressFax],
        countryID: [user.adress?.quarter?.town?.region?.countryID],
        regionID: [{ value: user.adress?.quarter?.town?.regionID, disabled: false }],
        townID: [{ value: user.adress?.quarter?.townID, disabled: false }],
        quarterID: [{ value: user.adress?.quarterID, disabled: false }]
      }),
      name: [user.name, Validators.required],
      tiergroup: [user.tiergroup],
      description: [user.description, Validators.required],
      cni: [user.cni, Validators.required],
      profileID: [user.profileID, Validators.required],
      sexID: [user.sex?.sexID ?? 1, Validators.required],
      isConnected: [user.isConnected],
      isMarketer: [user.isMarketer],
      isSeller: [user.isSeller],
      branchID: [user.branchID, Validators.required]
    });
  }

      closePopup(){
        closeModal("user-create-form")
      }


}

import { CompanyService } from './../../../../../generated/api/company.service';

import { CompanyModel, LocalisationService } from 'src/app/generated';

import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobModel, ProfileModel, CountryModel, QuarterModel, RegionModel, TownModel, BranchModel } from 'src/app/generated';
import { closeModal, confirmPasswordValidator } from 'src/app/helper/helper-function';
import { firstValueFrom } from 'rxjs';
import { BranchManagerService } from 'src/app/services/security/branch.service';


@Component({
  selector: 'app-branch-form',
  templateUrl: './branch-form.component.html',
  styleUrls: ['./branch-form.component.scss'],
})
export class BranchsFormComponent implements OnInit, OnChanges {


  @Input() branchToUpdate: BranchModel | null = null;

  public branchForm!: FormGroup;
  public error = '';
  countries: CountryModel[] = [];
  allRegions: RegionModel[] = [];
  allTowns: TownModel[] = [];
  allQuarters: QuarterModel[] = [];
  regions: RegionModel[] = [];
  towns: TownModel[] = [];
  quarters: QuarterModel[] = [];
  companies: CompanyModel[] = [];


  isSubmitted = false;

  constructor(private formBuilder: FormBuilder, private localisationService: LocalisationService, private companyService: CompanyService, private branchService: BranchManagerService,) {
    this.initCreateForm();
  }

  ngOnChanges(): void {

    if (this.branchToUpdate) {
      const quater = this.branchToUpdate.adress?.quarter
      if (quater) {
        this.filterRegions(quater.town?.region?.countryID ?? 0);
        this.filterTowns(quater.town?.regionID ?? 0);
        this.filterQuarters(quater.townID ?? 0);
      }
      this.initEditForm(this.branchToUpdate)

    } else {
      this.initCreateForm();
    }

    this.addEventListerneToQuarterSearch();

  }


  async ngOnInit() {
    try {
      [this.countries] = [await firstValueFrom(this.localisationService.localisationControllerGetAllCountrys())];
      this.allTowns = await firstValueFrom(this.localisationService.localisationControllerGetAllTowns());
      this.allRegions = await firstValueFrom(this.localisationService.localisationControllerGetAllRegions());
      this.allQuarters = await firstValueFrom(this.localisationService.localisationControllerGetAllQuarters());
      this.companies =  await firstValueFrom(this.companyService.companyControllerGetAllCompanies());


    } catch (err) {
    }
  }

  get form() {
    return this.branchForm.controls;
  }

  createOrUpdateBranch() {
    this.isSubmitted = true;
    if (this.branchForm.valid) {
      const branchModel: BranchModel = {
        branchID: this.form['branchID'].value,
        branchCode: this.form['branchCode'].value,
        branchAbbreviation: this.form['branchAbbreviation'].value,
        branchName: this.form['branchName'].value,
        branchDescription: this.form['branchDescription'].value,
        adress: this.form['adress'].value,
        adressID: this.branchToUpdate ? this.branchToUpdate.adressID : undefined,
        companyID: this.form['companyID'].value,
      }
      this.branchToUpdate ? this.branchService.updateBranch(branchModel) : this.branchService.addBranch(branchModel);
      this.isSubmitted = false;
    }


  }



  filterRegions(countryId: number) {
    this.regions = this.allRegions.filter(region => region.countryID === countryId);
    this.branchForm.get('adress.regionID')?.reset();
    this.branchForm.get('adress.regionID')?.enable();
    this.branchForm.get('adress.regionID')?.patchValue(null);
    // Reset and disable dependent fields
    this.branchForm.get('adress.townID')?.reset();
    this.branchForm.get('adress.townID')?.disable();
    this.branchForm.get('adress.quarterID')?.reset();
    this.branchForm.get('adress.quarterID')?.disable();
  }

  filterTowns(regionId: number) {
    this.towns = this.allTowns.filter(town => town.regionID === regionId);
    this.branchForm.get('adress.townID')?.reset();
    this.branchForm.get('adress.townID')?.enable();
    this.branchForm.get('adress.townID')?.patchValue(null);

    // Reset and disable dependent field
    this.branchForm.get('adress.quarterID')?.reset();
    this.branchForm.get('adress.quarterID')?.disable();
  }

  filterQuarters(townId: number) {
    this.quarters = this.allQuarters.filter(quarter => quarter.townID === townId);
    this.branchForm.get('adress.quarterID')?.reset();
    this.branchForm.get('adress.quarterID')?.enable();
    this.branchForm.get('adress.quarterID')?.patchValue(null);
  }

  addEventListerneToQuarterSearch() {
    this.branchForm.get('adress.countryID')?.valueChanges.subscribe(countryId => {
      this.filterRegions(countryId);
    });
    this.branchForm.get('adress.regionID')?.valueChanges.subscribe(regionId => {
      this.filterTowns(regionId);
    });

    this.branchForm.get('adress.townID')?.valueChanges.subscribe(townId => {
      this.filterQuarters(townId);
    });
  }

  initCreateForm() {
    this.branchForm = this.formBuilder.group({
      branchID: [0],
      branchCode: [null, Validators.required],
      branchAbbreviation: [null, Validators.required],
      branchName: [null, Validators.required],
      branchDescription: [null, Validators.required],
      companyID: [null, Validators.required],
      adress: this.formBuilder.group({
        adressPhoneNumber: [null, Validators.required],
        adressCellNumber: [null],
        adressFullName: [null],
        adressEmail: [null, Validators.required],
        adressWebSite: [null],
        adressPOBox: [null],
        adressFax: [null],
        countryID: [null, Validators.required],
        regionID: [{ value: null, disabled: true }, Validators.required],
        townID: [{ value: null, disabled: true }, Validators.required],
        quarterID: [{ value: null, disabled: true }, Validators.required],

      }),
    });
  }


  initEditForm(branch: BranchModel) {
    this.branchForm = this.formBuilder.group({
      branchID: [branch.branchID],
      branchCode: [branch.branchCode, Validators.required],
      companyID: [branch.companyID, Validators.required],
      branchAbbreviation: [branch.branchAbbreviation, Validators.required],
      branchName: [branch.branchName, Validators.required],
      branchDescription: [branch.branchDescription, Validators.required],
      adress: this.formBuilder.group({
        adressID: [branch.adress?.adressID],
        adressPhoneNumber: [branch.adress?.adressPhoneNumber, Validators.required],
        adressCellNumber: [branch.adress?.adressCellNumber],
        adressFullName: [branch.adress?.adressFullName],
        adressEmail: [branch.adress?.adressEmail, Validators.email],
        adressWebSite: [branch.adress?.adressWebSite],
        adressPOBox: [branch.adress?.adressPOBox],
        adressFax: [branch.adress?.adressFax],
        countryID: [branch.adress?.quarter?.town?.region?.countryID, Validators.required],
        regionID: [{ value: branch.adress?.quarter?.town?.regionID, disabled: false }, Validators.required],
        townID: [{ value: branch.adress?.quarter?.townID, disabled: false }, Validators.required],
        quarterID: [{ value: branch.adress?.quarterID, disabled: false }, Validators.required]
      }),
    });
  }

  closePopup() {
    closeModal("branch-create-form")
  }

}

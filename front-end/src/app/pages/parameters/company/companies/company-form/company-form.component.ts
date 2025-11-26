import { CompanyService } from './../../../../../generated/api/company.service';
import { CompanyModel, LocalisationService } from 'src/app/generated';
import { Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryModel, QuarterModel, RegionModel, TownModel } from 'src/app/generated';
import { closeModal } from 'src/app/helper/helper-function';
import { firstValueFrom } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss'],
})
export class CompanyFormComponent implements OnInit, OnChanges {

  @Input() companyToUpdate: CompanyModel | null = null;
  @Output() companyUpdated = new EventEmitter<void>();

  public companyForm!: FormGroup;
  public error = '';
  countries: CountryModel[] = [];
  allRegions: RegionModel[] = [];
  allTowns: TownModel[] = [];
  allQuarters: QuarterModel[] = [];
  regions: RegionModel[] = [];
  towns: TownModel[] = [];
  quarters: QuarterModel[] = [];

  // Logo handling
  files: File[] = [];
  existingLogoBase64: string | null = null;
  existingLogoUrl: SafeUrl | null = null;

  isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private localisationService: LocalisationService,
    private companyService: CompanyService,
    private sanitizer: DomSanitizer,
    private toastrService: ToastrService
  ) {
    this.initCreateForm();
  }

  ngOnChanges(): void {
    if (this.companyToUpdate) {
      const quarter = this.companyToUpdate.adress?.quarter;
      if (quarter) {
        this.filterRegions(quarter.town?.region?.countryID ?? 0);
        this.filterTowns(quarter.town?.regionID ?? 0);
        this.filterQuarters(quarter.townID ?? 0);
      }
      this.initEditForm(this.companyToUpdate);
      this.loadExistingLogo();
    } else {
      this.initCreateForm();
      this.resetLogoState();
    }

    this.addEventListenerToLocationSearch();
  }

  async ngOnInit() {
    try {
      [this.countries] = [await firstValueFrom(this.localisationService.localisationControllerGetAllCountrys())];
      this.allTowns = await firstValueFrom(this.localisationService.localisationControllerGetAllTowns());
      this.allRegions = await firstValueFrom(this.localisationService.localisationControllerGetAllRegions());
      this.allQuarters = await firstValueFrom(this.localisationService.localisationControllerGetAllQuarters());
    } catch (err) {
      console.error('Error loading location data:', err);
    }
  }

  get form() {
    return this.companyForm.controls;
  }

  async createOrUpdateCompany() {
    this.isSubmitted = true;
    if (this.companyForm.valid) {
      try {
        const companyParams = this.buildCompanyParams();
        const logo = this.files.length > 0 ? this.files[0] : undefined;

        if (this.companyToUpdate && companyParams.companyID) {
          // Update existing company
          await firstValueFrom(
            this.companyService.companyControllerUpdateCompany(
              companyParams.companyCode,
              companyParams.companyName,
              companyParams.companyID,
              companyParams.companyAbbreviation,
              companyParams.companyDescription,
              companyParams.adressID,
              companyParams.adressAdressID,
              companyParams.adressAdressPhoneNumber,
              companyParams.adressAdressCellNumber,
              companyParams.adressAdressFullName,
              companyParams.adressAdressEmail,
              companyParams.adressAdressWebSite,
              companyParams.adressAdressPOBox,
              companyParams.adressAdressFax,
              companyParams.adressQuarterID,
              undefined, // adressQuarterQuarterID - not needed, backend will get it
              undefined, // adressQuarterQuarterCode
              undefined, // adressQuarterQuarterLabel
              undefined, // adressQuarterTownID
              undefined, // adressQuarterTownTownID
              undefined, // adressQuarterTownTownCode
              undefined, // adressQuarterTownTownLabel
              undefined, // adressQuarterTownRegionID
              undefined, // adressQuarterTownRegionRegionID
              undefined, // adressQuarterTownRegionRegionCode
              undefined, // adressQuarterTownRegionRegionLabel
              undefined, // adressQuarterTownRegionCountryID
              undefined, // adressQuarterTownRegionCountryCountryID
              undefined, // adressQuarterTownRegionCountryCountryCode
              undefined, // adressQuarterTownRegionCountryCountryLabel
              logo
            )
          );
          this.toastrService.success('Company updated successfully', 'Success');
        } else {
          // Create new company
          await firstValueFrom(
            this.companyService.companyControllerCreateCompany(
              companyParams.companyCode,
              companyParams.companyName,
              undefined, // companyID will be generated by backend
              companyParams.companyAbbreviation,
              companyParams.companyDescription,
              undefined, // adressID will be generated by backend
              undefined, // adressAdressID
              companyParams.adressAdressPhoneNumber,
              companyParams.adressAdressCellNumber,
              companyParams.adressAdressFullName,
              companyParams.adressAdressEmail,
              companyParams.adressAdressWebSite,
              companyParams.adressAdressPOBox,
              companyParams.adressAdressFax,
              companyParams.adressQuarterID,
              undefined, // adressQuarterQuarterID - not needed
              undefined, // adressQuarterQuarterCode
              undefined, // adressQuarterQuarterLabel
              undefined, // adressQuarterTownID
              undefined, // adressQuarterTownTownID
              undefined, // adressQuarterTownTownCode
              undefined, // adressQuarterTownTownLabel
              undefined, // adressQuarterTownRegionID
              undefined, // adressQuarterTownRegionRegionID
              undefined, // adressQuarterTownRegionRegionCode
              undefined, // adressQuarterTownRegionRegionLabel
              undefined, // adressQuarterTownRegionCountryID
              undefined, // adressQuarterTownRegionCountryCountryID
              undefined, // adressQuarterTownRegionCountryCountryCode
              undefined, // adressQuarterTownRegionCountryCountryLabel
              logo
            )
          );
          this.toastrService.success('Company created successfully', 'Success');
        }

        this.isSubmitted = false;
        this.companyUpdated.emit();
        this.closePopup();
      } catch (error) {
        console.error('Error saving company:', error);
        this.toastrService.error('Failed to save company', 'Error');
        this.isSubmitted = false;
      }
    }
  }

  /**
   * Utility method to build company parameters from form
   * Extracts all necessary fields including address details
   * Only quarterID is sent for location, backend will resolve the hierarchy
   * @returns Object containing all company and address parameters
   */
  private buildCompanyParams() {
    const formValue = this.companyForm.value;
    const addressValue = formValue.adress;

    return {
      // Company fields
      companyID: formValue.companyID || undefined,
      companyCode: formValue.companyCode,
      companyName: formValue.companyName,
      companyAbbreviation: formValue.companyAbbreviation,
      companyDescription: formValue.companyDescription,

      // Address ID (for update)
      adressID: addressValue?.adressID || undefined,

      // Address basic fields
      adressAdressID: addressValue?.adressID || undefined,
      adressAdressPhoneNumber: addressValue?.adressPhoneNumber || undefined,
      adressAdressCellNumber: addressValue?.adressCellNumber || undefined,
      adressAdressFullName: addressValue?.adressFullName || undefined,
      adressAdressEmail: addressValue?.adressEmail || undefined,
      adressAdressWebSite: addressValue?.adressWebSite || undefined,
      adressAdressPOBox: addressValue?.adressPOBox || undefined,
      adressAdressFax: addressValue?.adressFax || undefined,

      // Location - Only quarterID is needed, backend will resolve town, region, country
      adressQuarterID: addressValue?.quarterID || undefined,
    };
  }

  onLogoSelect(event: any) {
    const addedFiles = event.addedFiles;
    if (addedFiles.length > 0) {
      // Only keep the most recent file (single file upload)
      this.files = [addedFiles[addedFiles.length - 1]];
      // Clear existing logo when new one is selected
      this.existingLogoUrl = null;
      this.existingLogoBase64 = null;
    }
  }

  onLogoRemove(file: File) {
    this.files = this.files.filter(f => f !== file);
  }

  removeExistingLogo() {
    this.existingLogoUrl = null;
    this.existingLogoBase64 = null;
  }

  loadExistingLogo() {
    if (this.companyToUpdate?.archive?.fileBase64) {
      // Archive contains Base64 encoded image
      const base64 = this.companyToUpdate.archive.fileBase64;
      const contentType = this.companyToUpdate.archive.contentType || 'image/png';

      // Store the base64 for reference
      this.existingLogoBase64 = base64;

      // Create data URL for display
      const dataUrl = `data:${contentType};base64,${base64}`;
      this.existingLogoUrl = this.sanitizer.bypassSecurityTrustUrl(dataUrl);
    }
  }

  resetLogoState() {
    this.files = [];
    this.existingLogoUrl = null;
    this.existingLogoBase64 = null;
  }

  filterRegions(countryId: number) {
    this.regions = this.allRegions.filter(region => region.countryID === countryId);
    this.companyForm.get('adress.regionID')?.reset();
    this.companyForm.get('adress.regionID')?.enable();
    this.companyForm.get('adress.regionID')?.patchValue(null);
    // Reset and disable dependent fields
    this.companyForm.get('adress.townID')?.reset();
    this.companyForm.get('adress.townID')?.disable();
    this.companyForm.get('adress.quarterID')?.reset();
    this.companyForm.get('adress.quarterID')?.disable();
  }

  filterTowns(regionId: number) {
    this.towns = this.allTowns.filter(town => town.regionID === regionId);
    this.companyForm.get('adress.townID')?.reset();
    this.companyForm.get('adress.townID')?.enable();
    this.companyForm.get('adress.townID')?.patchValue(null);

    // Reset and disable dependent field
    this.companyForm.get('adress.quarterID')?.reset();
    this.companyForm.get('adress.quarterID')?.disable();
  }

  filterQuarters(townId: number) {
    this.quarters = this.allQuarters.filter(quarter => quarter.townID === townId);
    this.companyForm.get('adress.quarterID')?.reset();
    this.companyForm.get('adress.quarterID')?.enable();
    this.companyForm.get('adress.quarterID')?.patchValue(null);
  }

  addEventListenerToLocationSearch() {
    this.companyForm.get('adress.countryID')?.valueChanges.subscribe(countryId => {
      this.filterRegions(countryId);
    });
    this.companyForm.get('adress.regionID')?.valueChanges.subscribe(regionId => {
      this.filterTowns(regionId);
    });

    this.companyForm.get('adress.townID')?.valueChanges.subscribe(townId => {
      this.filterQuarters(townId);
    });
  }

  initCreateForm() {
    this.companyForm = this.formBuilder.group({
      companyID: [0],
      companyCode: [null, Validators.required],
      companyName: [null, Validators.required],
      companyAbbreviation: [null, Validators.required],
      companyDescription: [null, Validators.required],
      adress: this.formBuilder.group({
        adressPhoneNumber: [null, Validators.required],
        adressCellNumber: [null],
        adressFullName: [null],
        adressEmail: [null, [Validators.required, Validators.email]],
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

  initEditForm(company: CompanyModel) {
    this.companyForm = this.formBuilder.group({
      companyID: [company.companyID],
      companyCode: [company.companyCode, Validators.required],
      companyName: [company.companyName, Validators.required],
      companyAbbreviation: [company.companyAbbreviation, Validators.required],
      companyDescription: [company.companyDescription, Validators.required],
      adress: this.formBuilder.group({
        adressID: [company.adress?.adressID],
        adressPhoneNumber: [company.adress?.adressPhoneNumber, Validators.required],
        adressCellNumber: [company.adress?.adressCellNumber],
        adressFullName: [company.adress?.adressFullName],
        adressEmail: [company.adress?.adressEmail, [Validators.required, Validators.email]],
        adressWebSite: [company.adress?.adressWebSite],
        adressPOBox: [company.adress?.adressPOBox],
        adressFax: [company.adress?.adressFax],
        countryID: [company.adress?.quarter?.town?.region?.countryID, Validators.required],
        regionID: [{ value: company.adress?.quarter?.town?.regionID, disabled: false }, Validators.required],
        townID: [{ value: company.adress?.quarter?.townID, disabled: false }, Validators.required],
        quarterID: [{ value: company.adress?.quarterID, disabled: false }, Validators.required]
      }),
    });
  }

  closePopup() {
    closeModal("company-create-form");
    this.resetLogoState();
    this.isSubmitted = false;
  }
}

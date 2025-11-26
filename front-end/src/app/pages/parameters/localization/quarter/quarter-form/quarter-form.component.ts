
import { CountryModel, LocalisationService, RegionModel, TownModel } from 'src/app/generated';

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuarterModel } from 'src/app/generated';
import { firstValueFrom } from 'rxjs';
import { closeModal } from 'src/app/helper/helper-function';



@Component({
  selector: 'app-quarter-form',
  templateUrl: './quarter-form.component.html',
  styleUrls: ['./quarter-form.component.scss'],
})
export class QuartersFormComponent implements OnInit, OnChanges {


  @Input() quarterToUpdate: QuarterModel | null = null;

  @Input() rowData: QuarterModel[] = [];

  @Output() rowDataChange = new EventEmitter<QuarterModel[]>(); // Prepare to emit changes


  countries: CountryModel[] = [];
  public quarterForm!: FormGroup;
  public error = '';

  allRegions: RegionModel[] = [];

  regions: RegionModel[] = [];

  towns: TownModel[] = [];

  allTowns: TownModel[] = [];

  isSubmitted = false;

  constructor(private formBuilder: FormBuilder, private localisationService: LocalisationService) {
    this.initCreateForm();
  }

  ngOnChanges(): void {

    if (this.quarterToUpdate) {

      const town = this.quarterToUpdate.town
      if (town) {
        this.filterRegions(town.region?.countryID ?? 0);
        this.filterTowns(town.region?.regionID ?? 0)
      }

      this.initEditForm(this.quarterToUpdate)

    } else {
      this.initCreateForm();
    }

    this.addEventListerneToRegionSearch()

  }

  async ngOnInit() {
    try {
      this.countries = await firstValueFrom(this.localisationService.localisationControllerGetAllCountrys());
      this.allRegions = await firstValueFrom(this.localisationService.localisationControllerGetAllRegions());
      this.allTowns = await firstValueFrom(this.localisationService.localisationControllerGetAllTowns());
    } catch (err) {
    }
  }


  filterRegions(countryId: number) {
    this.regions = this.allRegions.filter(region => region.countryID === countryId);
    this.quarterForm.get('regionID')?.reset();
    this.quarterForm.get('regionID')?.enable();
    this.quarterForm.get('regionID')?.patchValue(null);

    // Reset and disable dependent fields
    this.quarterForm.get('townID')?.reset();
    this.quarterForm.get('townID')?.disable();
  }

  filterTowns(regionId: number) {
    this.towns = this.allTowns.filter(town => town.regionID === regionId);
    this.quarterForm.get('townID')?.reset();
    this.quarterForm.get('townID')?.enable();
    this.quarterForm.get('townID')?.patchValue(null);
  }

  addEventListerneToRegionSearch() {
    this.quarterForm.get('countryID')?.valueChanges.subscribe(countryId => {
      this.filterRegions(countryId);
    });

    this.quarterForm.get('regionID')?.valueChanges.subscribe(regionId => {
      this.filterTowns(regionId);
    });
  }

  get form() {
    return this.quarterForm.controls;
  }

  async createOrUpdateQuarter() {

    this.isSubmitted = true;
    if (this.quarterForm.valid) {

      const QuarterModel: QuarterModel = {
        quarterID: this.form['quarterID']?.value,
        quarterCode: this.form['quarterCode'].value,
        quarterLabel: this.form['quarterLabel'].value,
        townID: this.form['townID'].value,
      }

      try {
        if (this.quarterToUpdate) {
          const newQuarter = await firstValueFrom(this.localisationService.localisationControllerUpdateQuarter(QuarterModel));
          if (newQuarter) {
            const index = this.rowData.findIndex(u => u.quarterID === this.quarterToUpdate?.quarterID);
            if (index !== -1) {
              this.rowData[index] = newQuarter;
            }
          }
        } else {
          const newQuarter = await firstValueFrom(this.localisationService.localisationControllerCreateQuarter(QuarterModel));
          if (newQuarter) {
            this.rowData.push(newQuarter);
          }
        }

        this.rowDataChange.emit(this.rowData);
        this.closePopup()

      } catch (error) {

      }
      this.isSubmitted = false;
    }
  }

  initCreateForm() {
    this.quarterForm = this.formBuilder.group({
      quarterCode: [null, Validators.required],
      quarterLabel: [null, Validators.required],
      countryID: [null, Validators.required],
      regionID: [{ value: null, disabled: true }, Validators.required],
      townID: [{ value: null, disabled: true }, Validators.required],
    });
  }


  initEditForm(quarter: QuarterModel) {
    this.quarterForm = this.formBuilder.group({
      quarterID: [quarter.quarterID],
      quarterCode: [quarter.quarterCode, Validators.required],
      quarterLabel: [quarter.quarterLabel, Validators.required],
      countryID: [quarter.town?.region?.countryID, Validators.required],
      regionID: [quarter.town?.region?.regionID, Validators.required],
      townID: [quarter.town?.townID, Validators.required],
    });
  }

  closePopup(){
    closeModal("quarter-create-form")
  }


}

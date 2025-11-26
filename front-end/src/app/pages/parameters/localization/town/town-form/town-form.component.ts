
import { CountryModel, LocalisationService, RegionModel } from 'src/app/generated';

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TownModel } from 'src/app/generated';
import { firstValueFrom } from 'rxjs';
import { closeModal } from 'src/app/helper/helper-function';



@Component({
  selector: 'app-town-form',
  templateUrl: './town-form.component.html',
  styleUrls: ['./town-form.component.scss'],
})
export class TownsFormComponent implements OnInit, OnChanges {


  @Input() townToUpdate: TownModel | null = null;

  @Input() rowData: TownModel[] = [];

  @Output() rowDataChange = new EventEmitter<TownModel[]>(); // Prepare to emit changes


  countries: CountryModel[] = [];
  public townForm!: FormGroup;
  public error = '';

  allRegions: RegionModel[] = [];

  regions: RegionModel[] = [];

  isSubmitted = false;

  constructor(private formBuilder: FormBuilder, private localisationService: LocalisationService) {
    this.initCreateForm();
  }

  ngOnChanges(): void {

    if (this.townToUpdate) {

      const region = this.townToUpdate.region
      if (region) {
        this.filterRegions(region.countryID ?? 0);
      }

      this.initEditForm(this.townToUpdate)

    } else {
      this.initCreateForm();
    }

    this.addEventListerneToRegionSearch()

  }

  async ngOnInit() {
    try {
      this.countries = await firstValueFrom(this.localisationService.localisationControllerGetAllCountrys());
      this.allRegions = await firstValueFrom(this.localisationService.localisationControllerGetAllRegions());

    } catch (err) {
    }
  }


  filterRegions(countryId: number) {
    this.regions = this.allRegions.filter(region => region.countryID === countryId);
    this.townForm.get('regionID')?.reset();
    this.townForm.get('regionID')?.enable();
    this.townForm.get('regionID')?.patchValue(null);
  }

  addEventListerneToRegionSearch() {
    this.townForm.get('countryID')?.valueChanges.subscribe(countryId => {
      this.filterRegions(countryId);
    });

  }

  get form() {
    return this.townForm.controls;
  }

  async createOrUpdateTown() {

    this.isSubmitted = true;
    if (this.townForm.valid) {

      const TownModel: TownModel = {
        townID: this.form['townID']?.value,
        townCode: this.form['townCode'].value,
        townLabel: this.form['townLabel'].value,
        regionID: this.form['regionID'].value,
      }

      try {
        if (this.townToUpdate) {
          const newTown = await firstValueFrom(this.localisationService.localisationControllerUpdateTown(TownModel));
          if (newTown) {
            const index = this.rowData.findIndex(u => u.townID === this.townToUpdate?.townID);
            if (index !== -1) {
              this.rowData[index] = newTown;
            }
          }
        } else {
          const newTown = await firstValueFrom(this.localisationService.localisationControllerCreateTown(TownModel));
          if (newTown) {
            this.rowData.push(newTown);
          }
        }

        this.rowDataChange.emit(this.rowData);
        this.closePopup()

      } catch (error) {

      }
      this.isSubmitted = false;
    }
  }

  closePopup(){
    closeModal('town-create-form');
  }
  initCreateForm() {
    this.townForm = this.formBuilder.group({
      townCode: [null, Validators.required],
      townLabel: [null, Validators.required],
      countryID: [null, Validators.required],
      regionID: [{ value: null, disabled: true }, Validators.required],
    });
  }


  initEditForm(Town: TownModel) {
    this.townForm = this.formBuilder.group({
      townID: [Town.townID],
      townCode: [Town.townCode, Validators.required],
      townLabel: [Town.townLabel, Validators.required],
      countryID: [Town.region?.countryID, Validators.required],
      regionID: [Town.region?.regionID, Validators.required],
    });
  }

}


import { CountryModel, LocalisationService } from 'src/app/generated';

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegionModel } from 'src/app/generated';
import { firstValueFrom } from 'rxjs';
import { closeModal } from 'src/app/helper/helper-function';



@Component({
  selector: 'app-region-form',
  templateUrl: './region-form.component.html',
  styleUrls: ['./region-form.component.scss'],
})
export class RegionsFormComponent implements OnInit, OnChanges {


  @Input() regionToUpdate: RegionModel | null = null;

  @Input() rowData: RegionModel[] = [];

  @Output() rowDataChange = new EventEmitter<RegionModel[]>(); // Prepare to emit changes


  countries: CountryModel[] = [];


  public regionForm!: FormGroup;
  public error = '';



  isSubmitted = false;

  constructor(private formBuilder: FormBuilder, private localisationService: LocalisationService) {
    this.initCreateForm();
  }

  ngOnChanges(): void {

    if (this.regionToUpdate) {
      this.initEditForm(this.regionToUpdate)

    } else {
      this.initCreateForm();
    }

  }

  async ngOnInit() {
    try {
      this.countries = await firstValueFrom(this.localisationService.localisationControllerGetAllCountrys());

    } catch (err) {
    }
  }


  get form() {
    return this.regionForm.controls;
  }

  async createOrUpdateRegion() {

    this.isSubmitted = true;
    if (this.regionForm.valid) {

      const RegionModel: RegionModel = {
        regionID: this.form['regionID']?.value,
        regionCode: this.form['regionCode'].value,
        regionLabel: this.form['regionLabel'].value,
        countryID: this.form['countryID'].value,
      }

      try {
        if (this.regionToUpdate) {
          const newRegion = await firstValueFrom(this.localisationService.localisationControllerUpdateRegion(RegionModel));
          if (newRegion) {
            const index = this.rowData.findIndex(u => u.regionID === this.regionToUpdate?.regionID);
            if (index !== -1) {
              this.rowData[index] = newRegion;
            }
          }
        } else {
          const newRegion = await firstValueFrom(this.localisationService.localisationControllerCreateRegion(RegionModel));
          if (newRegion) {
            this.rowData.push(newRegion);
          }
        }

        this.rowDataChange.emit(this.rowData);
        closeModal('region-create-form');

      } catch (error) {

      }


      this.isSubmitted = false;

    }


  }

  closePopup(){
    closeModal('region-create-form');
  }

  initCreateForm() {
    this.regionForm = this.formBuilder.group({
      regionCode: [null, Validators.required],
      regionLabel: [null, Validators.required],
      countryID: [null, Validators.required],
    });
  }


  initEditForm(region: RegionModel) {
    this.regionForm = this.formBuilder.group({
      regionID: [region.regionID],
      regionCode: [region.regionCode, Validators.required],
      regionLabel: [region.regionLabel, Validators.required],
      countryID: [region.countryID, Validators.required],
    });
  }

}

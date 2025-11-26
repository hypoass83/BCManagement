
import { LocalisationService } from 'src/app/generated';

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryModel } from 'src/app/generated';
import { firstValueFrom } from 'rxjs';
import { closeModal } from 'src/app/helper/helper-function';



@Component({
  selector: 'app-country-form',
  templateUrl: './country-form.component.html',
  styleUrls: ['./country-form.component.scss'],
})
export class CountriesFormComponent implements OnInit, OnChanges {


  @Input() countryToUpdate: CountryModel | null = null;

  @Input() rowData: CountryModel[] = [];

  @Output() rowDataChange = new EventEmitter<CountryModel[]>(); // Prepare to emit changes



  public countryForm!: FormGroup;
  public error = '';



  isSubmitted = false;

  constructor(private formBuilder: FormBuilder, private localisationService: LocalisationService) {
    this.initCreateForm();
  }

  ngOnChanges(): void {

    if (this.countryToUpdate) {
      this.initEditForm(this.countryToUpdate)

    } else {
      this.initCreateForm();
    }

  }


  async ngOnInit() {

  }

  get form() {
    return this.countryForm.controls;
  }

  async createOrUpdateCountry() {

    this.isSubmitted = true;
    if (this.countryForm.valid) {

      const CountryModel: CountryModel = {
        countryID: this.form['countryID']?.value,
        countryCode: this.form['countryCode'].value,
        countryLabel: this.form['countryLabel'].value,
      }

      try {
        if (this.countryToUpdate) {
          const newCountry = await firstValueFrom(this.localisationService.localisationControllerUpdateCountry(CountryModel));
          if (newCountry) {
            const index = this.rowData.findIndex(u => u.countryID === this.countryToUpdate?.countryID);
            if (index !== -1) {
              this.rowData[index] = newCountry;
            }
          }
        } else {
          const newCountry = await firstValueFrom(this.localisationService.localisationControllerCreateCountry(CountryModel));
          if (newCountry) {
            this.rowData.push(newCountry);
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
    this.countryForm = this.formBuilder.group({
      countryCode: [null, Validators.required],
      countryLabel: [null, Validators.required],
    });
  }


  initEditForm(Country: CountryModel) {
    this.countryForm = this.formBuilder.group({
      countryID: [Country.countryID],
      countryCode: [Country.countryCode, Validators.required],
      countryLabel: [Country.countryLabel, Validators.required],
    });
  }

  closePopup(){
    closeModal("country-create-form")
  }

}

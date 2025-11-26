import { DepartmentService } from './../../../../../generated/api/department.service';

import { CountryModel, DepartmentModel, TaxeContributionService, LocalisationService, RegionModel, TaxeTypeModel } from 'src/app/generated';

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, Type } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TaxeContributionModel } from 'src/app/generated';
import { firstValueFrom } from 'rxjs';
import { closeModal } from 'src/app/helper/helper-function';



@Component({
  selector: 'app-taxe-form',
  templateUrl: './taxe-form.component.html',
  styleUrls: ['./taxe-form.component.scss'],
})
export class TaxeContributionsFormComponent implements OnInit, OnChanges {


  @Input() taxeContributionToUpdate: TaxeContributionModel | null = null;

  @Input() rowData: TaxeContributionModel[] = [];

  @Output() rowDataChange = new EventEmitter<TaxeContributionModel[]>(); // Prepare to emit changes

  public taxeContributionForm!: FormGroup;
  public error = '';

  isSubmitted = false;



  constructor(private formBuilder: FormBuilder, private TaxeContributionService: TaxeContributionService) {
    this.initCreateForm();
  }

  ngOnChanges(): void {

    if (this.taxeContributionToUpdate) {

      this.initEditForm(this.taxeContributionToUpdate)

    } else {
      this.initCreateForm();
    }

  }

  async ngOnInit() {


  }




  get form() {
    return this.taxeContributionForm.controls;
  }

  async createOrUpdateTaxeContribution() {

    this.isSubmitted = true;
    if (this.taxeContributionForm.valid) {



      const TaxeContributionModel: TaxeContributionModel = {
        taxeContributionID: this.form['taxeContributionID']?.value,
        taxeContributionCode: this.form['taxeContributionCode'].value,
        taxeContributionName: this.form['taxeContributionName'].value,
        taxeContributionDescription: this.form['taxeContributionDescription'].value,
        rate: this.form['isFixedAmount'].value ? null : this.form['rate'].value,
        fixedAmount: this.form['isFixedAmount'].value ? this.form['fixedAmount'].value : null,
        isActive: this.form['isActive'].value,
        type: this.form['isFixedAmount'].value ? TaxeTypeModel.NUMBER_2 : TaxeTypeModel.NUMBER_1,
      }

      try {
        if (this.taxeContributionToUpdate) {
          const newTaxeContribution = await firstValueFrom(this.TaxeContributionService.taxeContributionControllerUpdateTaxeContribution(TaxeContributionModel));
          if (newTaxeContribution) {
            const index = this.rowData.findIndex(u => u.taxeContributionID === this.taxeContributionToUpdate?.taxeContributionID);
            if (index !== -1) {
              this.rowData[index] = newTaxeContribution;
            }
          }
        } else {
          const newTaxeContribution = await firstValueFrom(this.TaxeContributionService.taxeContributionControllerCreateTaxeContribution(TaxeContributionModel));
          if (newTaxeContribution) {
            this.rowData.push(newTaxeContribution);
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
    this.taxeContributionForm = this.formBuilder.group({
      taxeContributionCode: [null, Validators.required],
      taxeContributionName: [null, Validators.required],
      taxeContributionDescription: [null, Validators.required],
      isFixedAmount: [true],
      rate: [null, this.rateRangeValidator(0, 99)],
      fixedAmount: [null],
      isActive: [true],
    });
  }





  initEditForm(TaxeContribution: TaxeContributionModel) {
    this.taxeContributionForm = this.formBuilder.group({
      taxeContributionID: [TaxeContribution.taxeContributionID],

      taxeContributionCode: [TaxeContribution.taxeContributionCode, Validators.required],
      taxeContributionName: [TaxeContribution.taxeContributionName, Validators.required],
      taxeContributionDescription: [TaxeContribution.taxeContributionDescription, Validators.required],
      isFixedAmount: [TaxeContribution.type != TaxeTypeModel.NUMBER_1],
      rate: [TaxeContribution.rate, this.rateRangeValidator(0, 99)],
      fixedAmount: [TaxeContribution.fixedAmount],
      isActive: [TaxeContribution.isActive, Validators.required],
    });
  }

  closePopup() {
    closeModal('taxe-contribution-create-form')
  }

  rateRangeValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = parseInt( control.value);
      console.log('sqdfqsdf',value)
      // ✅ Allow null or empty values (optional field)
      if (value === null || value === undefined) {
        return null;
      }

      // Validate range if value is provided
      if (typeof value === 'number' && (value < min || value > max)) {
        console.log('sqdfqsdf')
        return { outOfRange: true };
      }

      return null;
    };
  }


}

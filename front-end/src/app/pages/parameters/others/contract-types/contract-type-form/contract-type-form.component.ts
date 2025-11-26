// contract-type-form.component.ts
import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractTypeModel, ContractTypeService } from 'src/app/generated';
import { closeModal } from 'src/app/helper/helper-function';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contract-type-form',
  templateUrl: './contract-type-form.component.html'
})
export class ContractTypeFormComponent implements OnChanges {

  @Input() contractTypeToUpdate: ContractTypeModel | null = null;
  @Output() contractTypeSaved = new EventEmitter<void>();

  public contractTypeForm!: FormGroup;
  public isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private contractTypeService: ContractTypeService,
    private toastrService: ToastrService
  ) {
    this.initCreateForm();
  }

  ngOnChanges(): void {
    if (this.contractTypeToUpdate) {
      this.initEditForm(this.contractTypeToUpdate);
    } else {
      this.initCreateForm();
    }
  }

  get form() {
    return this.contractTypeForm.controls;
  }

  async createOrUpdateContractType() {
    this.isSubmitted = true;

    if (this.contractTypeForm.valid) {
      try {
        const model: ContractTypeModel = {
          contractTypeID: this.form['contractTypeID'].value,
          contractTypeCode: this.form['contractTypeCode'].value,
          contractTypeName: this.form['contractTypeName'].value,
          contractTypeDescription: this.form['contractTypeDescription'].value
        };

        if (this.contractTypeToUpdate) {
          await firstValueFrom(
            this.contractTypeService.contractTypeControllerUpdateContractType(model)
          );
          this.toastrService.success('Contract type updated successfully', 'Success');
        } else {
          await firstValueFrom(
            this.contractTypeService.contractTypeControllerCreateContractType(model)
          );
          this.toastrService.success('Contract type created successfully', 'Success');
        }

        this.isSubmitted = false;
        this.contractTypeSaved.emit();
        this.closePopup();
      } catch (error: any) {
        this.toastrService.error(
          error?.error?.message || 'Failed to save contract type',
          'Error'
        );
      }
    }
  }

  initCreateForm() {
    this.contractTypeForm = this.formBuilder.group({
      contractTypeID: [0],
      contractTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
      contractTypeName: ['', [Validators.required, Validators.maxLength(200)]],
      contractTypeDescription: ['', Validators.maxLength(500)]
    });
  }

  initEditForm(contractType: ContractTypeModel) {
    this.contractTypeForm = this.formBuilder.group({
      contractTypeID: [contractType.contractTypeID],
      contractTypeCode: [contractType.contractTypeCode, [Validators.required, Validators.maxLength(50)]],
      contractTypeName: [contractType.contractTypeName, [Validators.required, Validators.maxLength(200)]],
      contractTypeDescription: [contractType.contractTypeDescription, Validators.maxLength(500)]
    });
  }

  closePopup() {
    closeModal("contract-type-form");
    this.isSubmitted = false;
    this.initCreateForm();
  }
}

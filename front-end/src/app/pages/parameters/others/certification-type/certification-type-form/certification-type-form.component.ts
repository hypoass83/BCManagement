// certification-type-form.component.ts
import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CertificationTypeModel,
  CertificationTypeCreateDTO,
  CertificationTypeUpdateDTO,
  CertificationTypeService
} from 'src/app/generated';
import { closeModal } from 'src/app/helper/helper-function';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-certification-type-form',
  templateUrl: './certification-type-form.component.html',
  styleUrls: ['./certification-type-form.component.scss'],
})
export class CertificationTypeFormComponent implements OnChanges {

  @Input() certificationTypeToUpdate: CertificationTypeModel | null = null;
  @Output() certificationTypeSaved = new EventEmitter<void>();

  public certificationTypeForm!: FormGroup;
  public isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private certificationTypeService: CertificationTypeService,
    private toastrService: ToastrService
  ) {
    this.initCreateForm();
  }

  ngOnChanges(): void {
    if (this.certificationTypeToUpdate) {
      this.initEditForm(this.certificationTypeToUpdate);
    } else {
      this.initCreateForm();
    }
  }

  get form() {
    return this.certificationTypeForm.controls;
  }

  async createOrUpdateCertificationType() {
    this.isSubmitted = true;

    if (this.certificationTypeForm.valid) {
      try {
        if (this.certificationTypeToUpdate) {
          // Update
          const updateDto: CertificationTypeUpdateDTO = {
            certificationTypeID: this.form['certificationTypeID'].value,
            code: this.form['code'].value,
            name: this.form['name'].value,
            description: this.form['description'].value,
            defaultBonusAmount: this.form['defaultBonusAmount'].value,
            isActive: this.form['isActive'].value
          };

          await firstValueFrom(
            this.certificationTypeService.certificationTypeControllerUpdateCertificationType(
              updateDto.certificationTypeID!,
              updateDto
            )
          );

          this.toastrService.success('Certification type updated successfully', 'Success');
        } else {
          // Create
          const createDto: CertificationTypeCreateDTO = {
            code: this.form['code'].value,
            name: this.form['name'].value,
            description: this.form['description'].value,
            defaultBonusAmount: this.form['defaultBonusAmount'].value,
            isActive: this.form['isActive'].value
          };

          await firstValueFrom(
            this.certificationTypeService.certificationTypeControllerCreateCertificationType(createDto)
          );

          this.toastrService.success('Certification type created successfully', 'Success');
        }

        this.isSubmitted = false;
        this.certificationTypeSaved.emit();
        this.closePopup();
      } catch (error: any) {
        this.toastrService.error(
          error?.error?.message || 'Failed to save certification type',
          'Error'
        );
      }
    }
  }

  initCreateForm() {
    this.certificationTypeForm = this.formBuilder.group({
      certificationTypeID: [0],
      code: ['', [Validators.required, Validators.maxLength(20)]],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', Validators.maxLength(500)],
      defaultBonusAmount: [0, [Validators.required, Validators.min(0)]],
      isActive: [true]
    });
  }

  initEditForm(certificationType: CertificationTypeModel) {
    this.certificationTypeForm = this.formBuilder.group({
      certificationTypeID: [certificationType.certificationTypeID],
      code: [certificationType.code, [Validators.required, Validators.maxLength(20)]],
      name: [certificationType.name, [Validators.required, Validators.maxLength(200)]],
      description: [certificationType.description, Validators.maxLength(500)],
      defaultBonusAmount: [certificationType.defaultBonusAmount, [Validators.required, Validators.min(0)]],
      isActive: [certificationType.isActive]
    });
  }

  closePopup() {
    closeModal("certification-type-create-form");
    this.isSubmitted = false;
    this.initCreateForm();
  }
}

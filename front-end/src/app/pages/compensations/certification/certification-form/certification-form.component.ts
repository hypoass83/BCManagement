// certification-form.component.ts
import { Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CertificationModel,
  CertificationCreateDTO,
  CertificationUpdateDTO,
  CertificationService,
  CertificationTypeService,
  CertificationTypeModel,
  EmployeeService,
  EmployeeModel
} from 'src/app/generated';
import { closeModal } from 'src/app/helper/helper-function';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-certification-form',
  templateUrl: './certification-form.component.html',
  styleUrls: ['./certification-form.component.scss'],
})
export class CertificationFormComponent implements OnInit, OnChanges {

  @Input() certificationToUpdate: CertificationModel | null = null;
  @Output() certificationSaved = new EventEmitter<void>();

  public certificationForm!: FormGroup;
  public employees: EmployeeModel[] = [];
  public certificationTypes: CertificationTypeModel[] = [];
  public isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private certificationService: CertificationService,
    private certificationTypeService: CertificationTypeService,
    private employeeService: EmployeeService,
    private toastrService: ToastrService
  ) {
    this.initCreateForm();
  }

  async ngOnInit() {
    try {
      this.employees = await firstValueFrom(
        this.employeeService.employeeControllerGetAllEmployees()
      );

      this.certificationTypes = await firstValueFrom(
        this.certificationTypeService.certificationTypeControllerGetActiveCertificationTypes()
      );
    } catch (error: any) {
      this.toastrService.error(
        error?.error?.message || 'Failed to load data',
        'Error'
      );
    }

    this.setupFormListeners();
  }

  ngOnChanges(): void {
    if (this.certificationToUpdate) {
      this.initEditForm(this.certificationToUpdate);
    } else {
      this.initCreateForm();
    }
  }

  setupFormListeners() {
    // Auto-remplir le bonus depuis le type sélectionné
    this.certificationForm.get('certificationTypeId')?.valueChanges.subscribe((typeId) => {
      const selectedType = this.certificationTypes.find(t => t.certificationTypeID === typeId);
      if (selectedType && !this.certificationToUpdate) {
        this.certificationForm.get('effectiveBonusAmount')?.setValue(selectedType.defaultBonusAmount);
      }
    });
  }

  get form() {
    return this.certificationForm.controls;
  }

  async createOrUpdateCertification() {
    this.isSubmitted = true;

    if (this.certificationForm.valid) {
      try {
        if (this.certificationToUpdate) {
          // Update
          const updateDto: CertificationUpdateDTO = {
            certificationId: this.form['certificationId'].value,
            title: this.form['title'].value,
            awardDate: this.form['awardDate'].value,
            description: this.form['description'].value,
            effectiveBonusAmount: this.form['effectiveBonusAmount'].value,
            certificationTypeId: this.form['certificationTypeId'].value
          };

          await firstValueFrom(
            this.certificationService.certificationControllerUpdateCertification(
              updateDto.certificationId!,
              updateDto
            )
          );

          this.toastrService.success('Certification updated successfully', 'Success');
        } else {
          // Create
          const createDto: CertificationCreateDTO = {
            title: this.form['title'].value,
            awardDate: this.form['awardDate'].value,
            description: this.form['description'].value,
            effectiveBonusAmount: this.form['effectiveBonusAmount'].value,
            certificationTypeId: this.form['certificationTypeId'].value,
            employeeId: this.form['employeeId'].value
          };

          await firstValueFrom(
            this.certificationService.certificationControllerCreateCertification(createDto)
          );

          this.toastrService.success('Certification created successfully', 'Success');
        }

        this.isSubmitted = false;
        this.certificationSaved.emit();
        this.closePopup();
      } catch (error: any) {
        this.toastrService.error(
          error?.error?.message || 'Failed to save certification',
          'Error'
        );
      }
    }
  }

  initCreateForm() {
    this.certificationForm = this.formBuilder.group({
      certificationId: [0],
      title: ['', [Validators.required, Validators.maxLength(200)]],
      awardDate: [new Date().toISOString().split('T')[0], Validators.required],
      description: ['', Validators.maxLength(1000)],
      effectiveBonusAmount: [0, [Validators.required, Validators.min(0)]],
      certificationTypeId: [null, Validators.required],
      employeeId: [null, Validators.required]
    });
  }

  initEditForm(certification: CertificationModel) {
    this.certificationForm = this.formBuilder.group({
      certificationId: [certification.certificationId],
      title: [certification.title, [Validators.required, Validators.maxLength(200)]],
      awardDate: [
        certification.awardDate ? new Date(certification.awardDate).toISOString().split('T')[0] : '',
        Validators.required
      ],
      description: [certification.description, Validators.maxLength(1000)],
      effectiveBonusAmount: [certification.effectiveBonusAmount, [Validators.required, Validators.min(0)]],
      certificationTypeId: [certification.certificationTypeId, Validators.required],
      employeeId: [{ value: certification.employeeId, disabled: true }]
    });
  }

  closePopup() {
    closeModal("certification-create-form");
    this.isSubmitted = false;
    this.initCreateForm();
  }
}

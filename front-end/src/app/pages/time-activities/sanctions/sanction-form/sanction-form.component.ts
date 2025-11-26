import { Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  SanctionModel,
  SanctionCreateDTO,
  SanctionUpdateDTO,
  SanctionService,
  EmployeeService,
  EmployeeModel
} from 'src/app/generated';
import { closeModal } from 'src/app/helper/helper-function';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sanction-form',
  templateUrl: './sanction-form.component.html',
  styleUrls: ['./sanction-form.component.scss'],
})
export class SanctionFormComponent implements OnInit, OnChanges {

  @Input() sanctionToUpdate: SanctionModel | null = null;
  @Output() sanctionSaved = new EventEmitter<void>();

  public sanctionForm!: FormGroup;
  public employees: EmployeeModel[] = [];
  public isSubmitted = false;

  // Sanction type options
  public sanctionTypeOptions = [
    { label: 'Avertissement', value: 0, icon: 'ti-alert-triangle', color: 'warning', description: 'Premier niveau de sanction' },
    { label: 'Blâme', value: 1, icon: 'ti-alert-circle', color: 'orange', description: 'Sanction écrite officielle' },
    { label: 'Mise à pied', value: 2, icon: 'ti-ban', color: 'danger', description: 'Suspension temporaire' },
    { label: 'Réduction de salaire', value: 3, icon: 'ti-cash-off', color: 'purple', description: 'Pénalité financière permanente' },
    { label: 'Licenciement', value: 4, icon: 'ti-door-exit', color: 'dark', description: 'Sanction la plus grave' }
  ];

  // Selected type
  public selectedSanctionType: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private sanctionService: SanctionService,
    private employeeService: EmployeeService,
    private toastrService: ToastrService
  ) {
    this.initCreateForm();
  }

  async ngOnInit() {
    try {
      // Charger les employés
      this.employees = await firstValueFrom(
        this.employeeService.employeeControllerGetAllEmployees()
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
    if (this.sanctionToUpdate) {
      this.initEditForm(this.sanctionToUpdate);
    } else {
      this.initCreateForm();
    }
  }

  setupFormListeners() {
    // Écouter les changements de type de sanction
    this.sanctionForm.get('sanctionType')?.valueChanges.subscribe((type) => {
      this.selectedSanctionType = this.sanctionTypeOptions.find(opt => opt.value === type);
      this.updateFieldsBasedOnType(type);
    });
  }

  updateFieldsBasedOnType(type: number) {
    const financialPenaltyControl = this.sanctionForm.get('financialPenalty');
    const suspensionDaysControl = this.sanctionForm.get('suspensionDays');

    // Reset validators
    financialPenaltyControl?.clearValidators();
    suspensionDaysControl?.clearValidators();

    // Type 2 = Mise à pied (nécessite suspensionDays)
    if (type === 2) {
      suspensionDaysControl?.setValidators([Validators.required, Validators.min(1), Validators.max(365)]);
      this.toastrService.info('Suspension days required for "Mise à pied"', 'Info');
    }

    // Type 3 = Réduction salaire (nécessite financialPenalty)
    if (type === 3) {
      financialPenaltyControl?.setValidators([Validators.required, Validators.min(1)]);
      this.toastrService.info('Financial penalty required for "Réduction de salaire"', 'Info');
    }

    financialPenaltyControl?.updateValueAndValidity();
    suspensionDaysControl?.updateValueAndValidity();
  }

  get form() {
    return this.sanctionForm.controls;
  }

  async createOrUpdateSanction() {
    this.isSubmitted = true;

    if (this.sanctionForm.valid) {
      try {
        if (this.sanctionToUpdate) {
          // Update
          const updateDto: SanctionUpdateDTO = {
            sanctionId: this.form['sanctionId'].value,
            sanctionType: this.form['sanctionType'].value,
            sanctionDate: this.form['sanctionDate'].value,
            description: this.form['description'].value,
            reason: this.form['reason'].value,
            financialPenalty: this.form['financialPenalty'].value,
            suspensionDays: this.form['suspensionDays'].value,
            comment: this.form['comment'].value
          };

          await firstValueFrom(
            this.sanctionService.sanctionControllerUpdateSanction(
              updateDto.sanctionId!,
              updateDto
            )
          );

          this.toastrService.success('Sanction updated successfully', 'Success');
        } else {
          // Create
          const createDto: SanctionCreateDTO = {
            sanctionType: this.form['sanctionType'].value,
            sanctionDate: this.form['sanctionDate'].value,
            description: this.form['description'].value,
            reason: this.form['reason'].value,
            financialPenalty: this.form['financialPenalty'].value || 0,
            suspensionDays: this.form['suspensionDays'].value,
            comment: this.form['comment'].value,
            employeeId: this.form['employeeId'].value
          };

          await firstValueFrom(
            this.sanctionService.sanctionControllerCreateSanction(createDto)
          );

          this.toastrService.success('Sanction created successfully', 'Success');
        }

        this.isSubmitted = false;
        this.sanctionSaved.emit();
        this.closePopup();
      } catch (error: any) {
        this.toastrService.error(
          error?.error?.message || 'Failed to save sanction',
          'Error'
        );
      }
    }
  }

  initCreateForm() {
    this.sanctionForm = this.formBuilder.group({
      sanctionId: [0],
      sanctionType: [0, Validators.required],
      employeeId: [null, Validators.required],
      sanctionDate: [new Date().toISOString().split('T')[0], Validators.required],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      reason: ['', [Validators.required, Validators.maxLength(500)]],
      financialPenalty: [0, [Validators.min(0)]],
      suspensionDays: [null, [Validators.min(1), Validators.max(365)]],
      comment: ['', Validators.maxLength(500)]
    });
  }

  initEditForm(sanction: SanctionModel) {
    this.selectedSanctionType = this.sanctionTypeOptions.find(opt => opt.value === sanction.sanctionType);

    this.sanctionForm = this.formBuilder.group({
      sanctionId: [sanction.sanctionId],
      sanctionType: [sanction.sanctionType, Validators.required],
      employeeId: [{ value: sanction.employeeId, disabled: true }],
      sanctionDate: [
        sanction.sanctionDate ? new Date(sanction.sanctionDate).toISOString().split('T')[0] : '',
        Validators.required
      ],
      description: [sanction.description, [Validators.required, Validators.maxLength(1000)]],
      reason: [sanction.reason, [Validators.required, Validators.maxLength(500)]],
      financialPenalty: [sanction.financialPenalty || 0, [Validators.min(0)]],
      suspensionDays: [sanction.suspensionDays, [Validators.min(1), Validators.max(365)]],
      comment: [sanction.comment, Validators.maxLength(500)]
    });
  }

  closePopup() {
    closeModal("sanction-create-form");
    this.isSubmitted = false;
    this.selectedSanctionType = null;
    this.initCreateForm();
  }
}

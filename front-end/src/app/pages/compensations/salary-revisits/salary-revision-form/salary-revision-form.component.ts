import { Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  SalaryRevisionModel,
  SalaryRevisionCreateDTO,
  SalaryRevisionUpdateDTO,
  SalaryRevisionService,
  EmployeeService,
  EmployeeModel,
  BranchService,
  BranchModel
} from 'src/app/generated';
import { closeModal } from 'src/app/helper/helper-function';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-salary-revision-form',
  templateUrl: './salary-revision-form.component.html',
  styleUrls: ['./salary-revision-form.component.scss'],
})
export class SalaryRevisionFormComponent implements OnInit, OnChanges {

  @Input() revisionToUpdate: SalaryRevisionModel | null = null;
  @Output() revisionSaved = new EventEmitter<void>();

  public revisionForm!: FormGroup;
  public employees: EmployeeModel[] = [];
  public branches: BranchModel[] = [];
  public isSubmitted = false;

  // Revision type options
  public revisionTypeOptions = [
    { label: 'Augmentation', value: 0, icon: 'ti-arrow-up', color: 'success' },
    { label: 'Déduction', value: 1, icon: 'ti-arrow-down', color: 'danger' }
  ];

  // Revision scope options
  public revisionScopeOptions = [
    { label: 'Individual Revision', value: 'individual' },
    { label: 'Collective Revision (Branch)', value: 'collective' }
  ];

  public selectedScope: 'individual' | 'collective' = 'individual';

  constructor(
    private formBuilder: FormBuilder,
    private salaryRevisionService: SalaryRevisionService,
    private employeeService: EmployeeService,
    private branchService: BranchService,
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

      // Charger les branches
      this.branches = await firstValueFrom(
        this.branchService.branchControllerGetAllBranchs()
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
    if (this.revisionToUpdate) {
      this.initEditForm(this.revisionToUpdate);
    } else {
      this.initCreateForm();
    }
  }

  setupFormListeners() {
    // Écouter les changements de scope
    this.revisionForm.get('revisionScope')?.valueChanges.subscribe((scope) => {
      this.selectedScope = scope;

      if (scope === 'individual') {
        this.revisionForm.get('employeeId')?.setValidators([Validators.required]);
        this.revisionForm.get('branchId')?.clearValidators();
        this.revisionForm.get('branchId')?.setValue(null);
      } else {
        this.revisionForm.get('branchId')?.setValidators([Validators.required]);
        this.revisionForm.get('employeeId')?.clearValidators();
        this.revisionForm.get('employeeId')?.setValue(null);
      }

      this.revisionForm.get('employeeId')?.updateValueAndValidity();
      this.revisionForm.get('branchId')?.updateValueAndValidity();
    });
  }

  get form() {
    return this.revisionForm.controls;
  }

  async createOrUpdateRevision() {
    this.isSubmitted = true;

    if (this.revisionForm.valid) {
      try {
        if (this.revisionToUpdate) {
          // Update
          const updateDto: SalaryRevisionUpdateDTO = {
            salaryRevisionId: this.form['salaryRevisionId'].value,
            revisionType: this.form['revisionType'].value,
            amount: this.form['amount'].value,
            effectiveDate: this.form['effectiveDate'].value,
            reason: this.form['reason'].value
          };

          await firstValueFrom(
            this.salaryRevisionService.salaryRevisionControllerUpdateSalaryRevision(
              updateDto.salaryRevisionId!,
              updateDto
            )
          );

          this.toastrService.success('Salary revision updated successfully', 'Success');
        } else {
          // Create
          const createDto: SalaryRevisionCreateDTO = {
            revisionType: this.form['revisionType'].value,
            amount: this.form['amount'].value,
            effectiveDate: this.form['effectiveDate'].value,
            reason: this.form['reason'].value,
            employeeId: this.selectedScope === 'individual' ? this.form['employeeId'].value : null,
            branchId: this.selectedScope === 'collective' ? this.form['branchId'].value : null
          };

          await firstValueFrom(
            this.salaryRevisionService.salaryRevisionControllerCreateSalaryRevision(createDto)
          );

          this.toastrService.success('Salary revision created successfully', 'Success');
        }

        this.isSubmitted = false;
        this.revisionSaved.emit();
        this.closePopup();
      } catch (error: any) {
        this.toastrService.error(
          error?.error?.message || 'Failed to save salary revision',
          'Error'
        );
      }
    }
  }

  initCreateForm() {
    this.revisionForm = this.formBuilder.group({
      salaryRevisionId: [0],
      revisionType: [0, Validators.required],
      revisionScope: ['individual', Validators.required],
      employeeId: [null, Validators.required],
      branchId: [null],
      amount: [null, [Validators.required, Validators.min(1)]],
      effectiveDate: [new Date().toISOString().split('T')[0], Validators.required],
      reason: [null, Validators.maxLength(500)]
    });
  }

  initEditForm(revision: SalaryRevisionModel) {
    this.selectedScope = revision.isIndividual ? 'individual' : 'collective';

    this.revisionForm = this.formBuilder.group({
      salaryRevisionId: [revision.salaryRevisionId],
      revisionType: [revision.revisionType, Validators.required],
      revisionScope: [{ value: this.selectedScope, disabled: true }],
      employeeId: [{ value: revision.employeeId, disabled: true }],
      branchId: [{ value: revision.branchId, disabled: true }],
      amount: [revision.amount, [Validators.required, Validators.min(1)]],
      effectiveDate: [
        revision.effectiveDate ? new Date(revision.effectiveDate).toISOString().split('T')[0] : null,
        Validators.required
      ],
      reason: [revision.reason, Validators.maxLength(500)]
    });
  }

  closePopup() {
    closeModal("salary-revision-create-form");
    this.isSubmitted = false;
    this.initCreateForm();
  }

  getSelectedRevisionTypeLabel(): string {
    const type = this.revisionForm.get('revisionType')?.value;
    const option = this.revisionTypeOptions.find(o => o.value === type);
    return option?.label || '';
  }
}

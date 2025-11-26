import { Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BonusModel,
  BonusCreateDTO,
  BonusUpdateDTO,
  BonusService,
  EmployeeService,
  EmployeeModel,
  BranchService,
  BranchModel
} from 'src/app/generated';
import { closeModal } from 'src/app/helper/helper-function';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bonus-form',
  templateUrl: './bonus-form.component.html',
  styleUrls: ['./bonus-form.component.scss'],
})
export class BonusFormComponent implements OnInit, OnChanges {

  @Input() bonusToUpdate: BonusModel | null = null;
  @Output() bonusSaved = new EventEmitter<void>();

  public bonusForm!: FormGroup;
  public employees: EmployeeModel[] = [];
  public branches: BranchModel[] = [];
  public isSubmitted = false;

  // Bonus type options
  public bonusTypeOptions = [
    { label: 'Individuel', value: 0 },
    { label: 'Collectif', value: 1 },
    { label: 'Performance', value: 2 },
    { label: 'Ancienneté', value: 3 },
    { label: 'Exception Performance', value: 4 },
    { label: 'Projet Complet', value: 5 },
    { label: 'Annuel (13ème mois)', value: 6 }
  ];

  // Bonus scope options
  public bonusScopeOptions = [
    { label: 'Individual Bonus', value: 'individual' },
    { label: 'Collective Bonus (Branch)', value: 'collective' }
  ];

  public selectedScope: 'individual' | 'collective' = 'individual';

  constructor(
    private formBuilder: FormBuilder,
    private bonusService: BonusService,
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
    if (this.bonusToUpdate) {
      this.initEditForm(this.bonusToUpdate);
    } else {
      this.initCreateForm();
    }
  }

  setupFormListeners() {
    // Écouter les changements de scope
    this.bonusForm.get('bonusScope')?.valueChanges.subscribe((scope) => {
      this.selectedScope = scope;

      if (scope === 'individual') {
        this.bonusForm.get('employeeId')?.setValidators([Validators.required]);
        this.bonusForm.get('branchId')?.clearValidators();
        this.bonusForm.get('branchId')?.setValue(null);
        this.bonusForm.get('bonusType')?.setValue(0);
      } else {
        this.bonusForm.get('branchId')?.setValidators([Validators.required]);
        this.bonusForm.get('employeeId')?.clearValidators();
        this.bonusForm.get('employeeId')?.setValue(null);
         this.bonusForm.get('bonusType')?.setValue(1);
      }

      this.bonusForm.get('employeeId')?.updateValueAndValidity();
      this.bonusForm.get('branchId')?.updateValueAndValidity();
    });
  }

  get form() {
    return this.bonusForm.controls;
  }

  async createOrUpdateBonus() {
    this.isSubmitted = true;

    if (this.bonusForm.valid) {
      try {
        if (this.bonusToUpdate) {
          // Update
          const updateDto: BonusUpdateDTO = {
            bonusId: this.form['bonusId'].value,
            bonusType: this.form['bonusType'].value,
            amount: this.form['amount'].value,
            awardDate: this.form['awardDate'].value,
            reason: this.form['reason'].value
          };

          await firstValueFrom(
            this.bonusService.bonusControllerUpdateBonus(
              updateDto.bonusId!,
              updateDto
            )
          );

          this.toastrService.success('Bonus updated successfully', 'Success');
        } else {
          // Create
          const createDto: BonusCreateDTO = {
            bonusType: this.form['bonusType'].value,
            amount: this.form['amount'].value,
            awardDate: this.form['awardDate'].value,
            reason: this.form['reason'].value,
            employeeId: this.selectedScope === 'individual' ? this.form['employeeId'].value : null,
            branchId: this.selectedScope === 'collective' ? this.form['branchId'].value : null
          };

          await firstValueFrom(
            this.bonusService.bonusControllerCreateBonus(createDto)
          );

          this.toastrService.success('Bonus created successfully', 'Success');
        }

        this.isSubmitted = false;
        this.bonusSaved.emit();
        this.closePopup();
      } catch (error: any) {
        this.toastrService.error(
          error?.error?.message || 'Failed to save bonus',
          'Error'
        );
      }
    }
  }

  initCreateForm() {
    this.bonusForm = this.formBuilder.group({
      bonusId: [0],
      bonusType: [0, Validators.required],
      bonusScope: ['individual', Validators.required],
      employeeId: [null, Validators.required],
      branchId: [null],
      amount: [null, [Validators.required, Validators.min(1)]],
      awardDate: [new Date().toISOString().split('T')[0], Validators.required],
      reason: [null, Validators.maxLength(500)]
    });
  }

  initEditForm(bonus: BonusModel) {
    this.selectedScope = bonus.isIndividual ? 'individual' : 'collective';

    this.bonusForm = this.formBuilder.group({
      bonusId: [bonus.bonusId],
      bonusType: [bonus.bonusType, Validators.required],
      bonusScope: [{ value: this.selectedScope, disabled: true }],
      employeeId: [{ value: bonus.employeeId, disabled: true }],
      branchId: [{ value: bonus.branchId, disabled: true }],
      amount: [bonus.amount, [Validators.required, Validators.min(1)]],
      awardDate: [
        bonus.awardDate ? new Date(bonus.awardDate).toISOString().split('T')[0] : null,
        Validators.required
      ],
      reason: [bonus.reason, Validators.maxLength(500)]
    });
  }

  closePopup() {
    closeModal("bonus-create-form");
    this.isSubmitted = false;

  }
}

import { Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  LoanModel,
  LoanCreateDTO,
  LoanUpdateDTO,
  LoanService,
  EmployeeService,
  EmployeeModel
} from 'src/app/generated';
import { closeModal } from 'src/app/helper/helper-function';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-loan-form',
  templateUrl: './loan-form.component.html',
  styleUrls: ['./loan-form.component.scss'],
})
export class LoanFormComponent implements OnInit, OnChanges {

  @Input() loanToUpdate: LoanModel | null = null;
  @Output() loanSaved = new EventEmitter<void>();

  public loanForm!: FormGroup;
  public employees: EmployeeModel[] = [];
  public isSubmitted = false;

  // Status options
  public statusOptions = [
    { label: 'En cours', value: 0 },
    { label: 'Soldé', value: 1 },
    { label: 'Annulé', value: 2 }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private loanService: LoanService,
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
    } catch (error: any) {
      this.toastrService.error(
        error?.error?.message || 'Failed to load employees',
        'Error'
      );
    }

    // Auto-calculate repayment months
    this.setupFormListeners();
  }

  ngOnChanges(): void {
    if (this.loanToUpdate) {
      this.initEditForm(this.loanToUpdate);
    } else {
      this.initCreateForm();
    }
  }

  setupFormListeners() {
    // Auto-calculate repayment months when amounts change
    this.loanForm.get('totalAmount')?.valueChanges.subscribe(() => {
      this.calculateRepaymentMonths();
    });

    this.loanForm.get('monthlyAmount')?.valueChanges.subscribe(() => {
      this.calculateRepaymentMonths();
    });
  }

  calculateRepaymentMonths() {
    const totalAmount = this.loanForm.get('totalAmount')?.value;
    const monthlyAmount = this.loanForm.get('monthlyAmount')?.value;

    if (totalAmount && monthlyAmount && monthlyAmount > 0) {
      const months = Math.ceil(totalAmount / monthlyAmount);
      this.loanForm.get('repaymentMonths')?.setValue(months, { emitEvent: false });
    }
  }

  get form() {
    return this.loanForm.controls;
  }

  async createOrUpdateLoan() {
    this.isSubmitted = true;

    if (this.loanForm.valid) {
      try {
        if (this.loanToUpdate) {
          // Update
          const updateDto: LoanUpdateDTO = {
            loanId: this.form['loanId'].value,
            monthlyAmount: this.form['monthlyAmount'].value,
            repaymentMonths: this.form['repaymentMonths'].value,
            status: this.form['status'].value,
            reason: this.form['reason'].value
          };

          await firstValueFrom(
            this.loanService.loanControllerUpdateLoan(
              updateDto.loanId!,
              updateDto
            )
          );

          this.toastrService.success('Loan updated successfully', 'Success');
        } else {
          // Create
          const createDto: LoanCreateDTO = {
            employeeId: this.form['employeeId'].value,
            totalAmount: this.form['totalAmount'].value,
            monthlyAmount: this.form['monthlyAmount'].value,
            grantDate: this.form['grantDate'].value,
            repaymentMonths: this.form['repaymentMonths'].value,
            reason: this.form['reason'].value
          };

          await firstValueFrom(
            this.loanService.loanControllerCreateLoan(createDto)
          );

          this.toastrService.success('Loan created successfully', 'Success');
        }

        this.isSubmitted = false;
        this.loanSaved.emit();
        this.closePopup();
      } catch (error: any) {
        this.toastrService.error(
          error?.error?.message || 'Failed to save loan',
          'Error'
        );
      }
    }
  }

  initCreateForm() {
    this.loanForm = this.formBuilder.group({
      loanId: [0],
      employeeId: [null, Validators.required],
      totalAmount: [null, [Validators.required, Validators.min(1)]],
      monthlyAmount: [null, [Validators.required, Validators.min(1)]],
      grantDate: [new Date().toISOString().split('T')[0], Validators.required],
      repaymentMonths: [{ value: 1, disabled: false }, [Validators.required, Validators.min(1)]],
      reason: [null, Validators.maxLength(500)]
    });
  }

  initEditForm(loan: LoanModel) {
    this.loanForm = this.formBuilder.group({
      loanId: [loan.loanId],
      employeeId: [{ value: loan.employeeId, disabled: true }, Validators.required],
      totalAmount: [{ value: loan.totalAmount, disabled: true }, [Validators.required, Validators.min(1)]],
      monthlyAmount: [loan.monthlyAmount, [Validators.required, Validators.min(1)]],
      grantDate: [
        { value: loan.grantDate ? new Date(loan.grantDate).toISOString().split('T')[0] : null, disabled: true },
        Validators.required
      ],
      repaymentMonths: [loan.repaymentMonths, [Validators.required, Validators.min(1)]],
      status: [loan.status, Validators.required],
      reason: [loan.reason, Validators.maxLength(500)]
    });
  }

  closePopup() {
    closeModal("loan-create-form");
    this.isSubmitted = false;
    this.initCreateForm();
  }
}

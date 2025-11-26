// contract-form.component.ts
import { Component, Input, OnChanges, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ContractModel,
  ContractCreateDTO,
  ContractUpdateDTO,
  EmployeeService,
  EmployeeModel,
  ContractTypeModel,
  SalaryModel
} from 'src/app/generated';
import { closeModal } from 'src/app/helper/helper-function';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ContractTypeService } from 'src/app/generated/api/contractType.service';

@Component({
  selector: 'app-contract-form',
  templateUrl: './contract-form.component.html',
  styleUrls: ['./contract-form.component.scss'],
})
export class ContractsFormComponent implements OnInit, OnChanges {
  @Input() contractToUpdate: ContractModel | null = null;
  @Input() employeeId: number | null = null;

  public contractForm!: FormGroup;
  public error = '';

  employees: EmployeeModel[] = [];
  contractTypes: ContractTypeModel[] = [];

  contractStatuses = [
    { label: 'Active', value: 0 },
    { label: 'Expired', value: 1 },
    { label: 'Terminated', value: 2 }
  ];

  isSubmitted = false;
  currentStep = signal<number>(0);
  isLoadingSalary = signal<boolean>(false);
  lastSalaryInfo = signal<SalaryModel | null>(null);
  selectedEmployee = signal<EmployeeModel | null>(null);

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private contractTypeService: ContractTypeService,
    private toastrService: ToastrService
  ) {
    this.initCreateForm();
  }

  ngOnChanges(): void {
    if (this.contractToUpdate) {
      this.initEditForm(this.contractToUpdate);
    } else {
      this.initCreateForm();
      if (this.employeeId) {
        this.contractForm.patchValue({ employeeId: this.employeeId });
        this.loadEmployeeInfo(this.employeeId);
      }
    }
  }

  async ngOnInit() {
    try {
      [this.employees, this.contractTypes] = await Promise.all([
        firstValueFrom(this.employeeService.employeeControllerGetAllEmployees()),
        firstValueFrom(this.contractTypeService.contractTypeControllerGetAllContractTypes())
      ]);
    } catch (err) {
      this.toastrService.error('Failed to load form data');
      console.error(err);
    }

    // Listen to employee selection changes
    this.contractForm.get('employeeId')?.valueChanges.subscribe(async (employeeId) => {
      if (employeeId && !this.contractToUpdate) {
        await this.loadEmployeeInfo(employeeId);
      }
    });
  }

  get form() {
    return this.contractForm.controls;
  }

  async loadEmployeeInfo(employeeId: number) {
    this.isLoadingSalary.set(true);

    try {
      // Load employee details
      const employee = this.employees.find(e => e.globalPersonID === employeeId);
      this.selectedEmployee.set(employee || null);

      // Try to load current salary
      try {
        const currentSalary = await firstValueFrom(
          this.employeeService.employeeControllerGetCurrentSalary(employeeId)
        );

        if (currentSalary) {
          this.lastSalaryInfo.set(currentSalary);

          // Auto-fill salary information
          this.contractForm.get('initialSalary')?.patchValue({
            baseSalary: currentSalary.baseSalary,
            transportAllowance: currentSalary.transportAllowance || 0,
            housingAllowance: currentSalary.housingAllowance || 0,
            dutyAllowance: currentSalary.dutyAllowance || 0,
            riskAllowance: currentSalary.riskAllowance || 0,
            overtimeAllowance: currentSalary.overtimeAllowance || 0,
            functionAllowance: currentSalary.functionAllowance || 0,
            otherAllowances: currentSalary.otherAllowances || 0,
            changeReason: 'Contract Renewal',
            effectiveDate: new Date().toISOString().split('T')[0]
          });

          this.toastrService.info('Previous salary loaded successfully');
        }
      } catch (error) {
        // No current salary found - this is fine for first contract
        this.lastSalaryInfo.set(null);
        console.log('No current salary found for employee - this is their first contract');
      }
    } catch (error) {
      this.toastrService.error('Failed to load employee information');
      console.error(error);
    } finally {
      this.isLoadingSalary.set(false);
    }
  }

  async nextStep() {
    this.isSubmitted = true;

    // Step 0 - Employee Selection
    if (this.currentStep() === 0) {
      if (!this.contractForm.get('employeeId')?.valid) {
        this.toastrService.error('Please select an employee');
        this.isSubmitted = false;
        return;
      }
      this.isSubmitted = false;
      this.currentStep.set(1);
      return;
    }

    // Step 1 - Contract Details
    if (this.currentStep() === 1) {
      const contractDetailsValid = this.validateContractDetails();
      if (!contractDetailsValid) {
        this.toastrService.error('Please fill all required contract details');
        this.isSubmitted = false;
        return;
      }
      this.isSubmitted = false;
      this.currentStep.set(2);
      return;
    }

    // Step 2 - Salary Information - Final Step
    if (this.currentStep() === 2) {
      const salaryValid = this.validateSalary();
      if (!salaryValid) {
        this.toastrService.error('Please fill all required salary information');
        this.isSubmitted = false;
        return;
      }

      // Create or update contract
      await this.createOrUpdateContract();
      return;
    }
  }

  prevStep() {
    if (this.currentStep() > 0) {
      this.currentStep.set(this.currentStep() - 1);
    }
  }

  validateContractDetails(): boolean {
    const contractTypeId = this.contractForm.get('contractTypeId');
    const startDate = this.contractForm.get('startDate');
    const contractStatus = this.contractForm.get('contractStatus');

    return !!(contractTypeId?.valid && startDate?.valid && contractStatus?.valid);
  }

  validateSalary(): boolean {
    const salaryGroup = this.contractForm.get('initialSalary');
    return !!salaryGroup?.valid;
  }

  async createOrUpdateContract() {
    this.isSubmitted = true;

    if (this.contractForm.valid) {
      try {
        if (this.contractToUpdate) {
          await this.updateContract();
        } else {
          await this.createContract();
        }
      } catch (error) {
        this.toastrService.error(
          this.contractToUpdate ? 'Failed to update contract' : 'Failed to create contract'
        );
        console.error(error);
      }
      this.isSubmitted = false;
    }
  }

  async createContract() {
    const formValue = this.contractForm.value;

    const contractDTO: ContractCreateDTO = {
      employeeId: formValue.employeeId,
      contractTypeId: formValue.contractTypeId,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
      probationPeriodMonths: formValue.probationPeriodMonths,
      contractStatus: formValue.contractStatus,
      terms: formValue.terms,
      contractReference: formValue.contractReference,
      initialSalary: {
        baseSalary: formValue.initialSalary.baseSalary,
        transportAllowance: formValue.initialSalary.transportAllowance,
        housingAllowance: formValue.initialSalary.housingAllowance,
        dutyAllowance: formValue.initialSalary.dutyAllowance,
        riskAllowance: formValue.initialSalary.riskAllowance,
        overtimeAllowance: formValue.initialSalary.overtimeAllowance,
        functionAllowance: formValue.initialSalary.functionAllowance,
        otherAllowances: formValue.initialSalary.otherAllowances,
        changeReason: formValue.initialSalary.changeReason,
        effectiveDate: formValue.initialSalary.effectiveDate
      }
    };

    await firstValueFrom(
      this.employeeService.employeeControllerCreateContract(
        formValue.employeeId,
        contractDTO
      )
    );

    this.toastrService.success('Contract created successfully');
    this.closePopup();
    window.location.reload();
  }

  async updateContract() {
    const formValue = this.contractForm.value;

    const contractUpdateDTO: ContractUpdateDTO = {
      contractId: this.contractToUpdate!.contractId!,
      employeeId: this.contractToUpdate!.contractId!,
      contractTypeId: formValue.contractTypeId,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
      probationPeriodMonths: formValue.probationPeriodMonths,
      contractStatus: formValue.contractStatus,
      terms: formValue.terms,
      contractReference: formValue.contractReference
    };



    await firstValueFrom(
      this.employeeService.employeeControllerUpdateContract(
        this.contractToUpdate!.employeeId!,
        this.contractToUpdate!.contractId!,
        contractUpdateDTO
      )
    );

    this.toastrService.success('Contract updated successfully');
    this.closePopup();
    window.location.reload();
  }

  initCreateForm() {
    this.contractForm = this.formBuilder.group({
      employeeId: [null, Validators.required],
      contractTypeId: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null],
      probationPeriodMonths: [null],
      contractStatus: [0, Validators.required],
      terms: [null],
      contractReference: [null],
      initialSalary: this.formBuilder.group({
        baseSalary: [null, [Validators.required, Validators.min(0)]],
        transportAllowance: [0, Validators.min(0)],
        housingAllowance: [0, Validators.min(0)],
        dutyAllowance: [0, Validators.min(0)],
        riskAllowance: [0, Validators.min(0)],
        overtimeAllowance: [0, Validators.min(0)],
        functionAllowance: [0, Validators.min(0)],
        otherAllowances: [0, Validators.min(0)],
        changeReason: ['New Contract'],
        effectiveDate: [new Date().toISOString().split('T')[0], Validators.required]
      })
    });
  }

  initEditForm(contract: ContractModel) {
    this.contractForm = this.formBuilder.group({
      employeeId: [{ value: contract.employeeId, disabled: true }, Validators.required],
      contractTypeId: [contract.contractTypeId, Validators.required],
      startDate: [contract.startDate, Validators.required],
      endDate: [contract.endDate],
      probationPeriodMonths: [contract.probationPeriodMonths],
      contractStatus: [contract.contractStatus, Validators.required],
      terms: [contract.terms],
      contractReference: [contract.contractReference],
      initialSalary: this.formBuilder.group({
        baseSalary: [{ value: contract.currentSalary?.baseSalary, disabled: true }],
        transportAllowance: [{ value: contract.currentSalary?.transportAllowance, disabled: true }],
        housingAllowance: [{ value: contract.currentSalary?.housingAllowance, disabled: true }],
        dutyAllowance: [{ value: contract.currentSalary?.dutyAllowance, disabled: true }],
        riskAllowance: [{ value: contract.currentSalary?.riskAllowance, disabled: true }],
        overtimeAllowance: [{ value: contract.currentSalary?.overtimeAllowance, disabled: true }],
        functionAllowance: [{ value: contract.currentSalary?.functionAllowance, disabled: true }],
        otherAllowances: [{ value: contract.currentSalary?.otherAllowances, disabled: true }],
        changeReason: [{ value: contract.currentSalary?.changeReason, disabled: true }],
        effectiveDate: [{ value: contract.currentSalary?.effectiveDate, disabled: true }]
      })
    });
  }

  calculateGrossSalary(): number {
    const salaryForm = this.contractForm.get('initialSalary');
    if (!salaryForm) return 0;

    const baseSalary = Number(salaryForm.get('baseSalary')?.value) || 0;
    const transportAllowance = Number(salaryForm.get('transportAllowance')?.value) || 0;
    const housingAllowance = Number(salaryForm.get('housingAllowance')?.value) || 0;
    const dutyAllowance = Number(salaryForm.get('dutyAllowance')?.value) || 0;
    const riskAllowance = Number(salaryForm.get('riskAllowance')?.value) || 0;
    const overtimeAllowance = Number(salaryForm.get('overtimeAllowance')?.value) || 0;
    const functionAllowance = Number(salaryForm.get('functionAllowance')?.value) || 0;
    const otherAllowances = Number(salaryForm.get('otherAllowances')?.value) || 0;

    return baseSalary + transportAllowance + housingAllowance + dutyAllowance +
      riskAllowance + overtimeAllowance + functionAllowance + otherAllowances;


  }

  calculateSalaryDifference(): number {
    if (!this.lastSalaryInfo()) return 0;
    return this.calculateGrossSalary() - (this.lastSalaryInfo()?.grossMonthlyBaseSalary || 0);
  }

  calculateSalaryPercentageChange(): number {
    if (!this.lastSalaryInfo() || !this.lastSalaryInfo()?.grossMonthlyBaseSalary) return 0;
    return (this.calculateSalaryDifference() / this.lastSalaryInfo()!.grossMonthlyBaseSalary!) * 100;
  }

  closePopup() {
    closeModal('contract-create-form');
    this.currentStep.set(0);
    this.lastSalaryInfo.set(null);
    this.selectedEmployee.set(null);
    this.employeeId = null;
  }

  steps = [
    { position: 0, subtitle: 'Employee Selection' },
    { position: 1, subtitle: 'Contract Details' },
    { position: 2, subtitle: 'Salary Information' }
  ];
}

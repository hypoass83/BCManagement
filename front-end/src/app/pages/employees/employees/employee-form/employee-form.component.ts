import { StudyField } from './../../../../generated/model/studyField';
import { StudyFieldService, DegreeService, DegreeModel, StudyFieldModel } from 'src/app/generated';
// employee-form.component.ts
import { Component, Input, OnChanges, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  EmployeeModel,
  EmployeeService,
  LocalisationService,
  CountryModel,
  RegionModel,
  TownModel,
  QuarterModel,
  BranchModel,
  DepartmentModel,
  JobModel,
  SexModel,
  EmployeeCreateBasicDTO,
  ContractCreateDTO,
  ContractTypeModel
} from 'src/app/generated';
import { closeModal } from 'src/app/helper/helper-function';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BranchService } from 'src/app/generated/api/branch.service';
import { DepartmentService } from 'src/app/generated/api/department.service';
import { JobService } from 'src/app/generated/api/job.service';

import { ContractTypeService } from 'src/app/generated/api/contractType.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
})
export class EmployeesFormComponent implements OnInit, OnChanges {
  @Input() employeeToUpdate: EmployeeModel | null = null;

  public employeeForm!: FormGroup;
  public error = '';

  countries: CountryModel[] = [];
  allRegions: RegionModel[] = [];
  allTowns: TownModel[] = [];
  allQuarters: QuarterModel[] = [];
  regions: RegionModel[] = [];
  towns: TownModel[] = [];
  quarters: QuarterModel[] = [];
  branches: BranchModel[] = [];

  studyFields: StudyFieldModel[] = [];
  degrees: DegreeModel[] = [];
  departments: DepartmentModel[] = [];
  jobs: JobModel[] = [];
  sexes: SexModel[] = [{
    sexLabel: "Male",
    sexID: 1,
  },

  {
    sexLabel: "Female",
    sexID: 2,
  }

  ];
  contractTypes: ContractTypeModel[] = [];

  maritalStatuses = [
    { label: 'Single', value: 'Single' },
    { label: 'Married', value: 'Married' },
    { label: 'Divorced', value: 'Divorced' },
    { label: 'Widowed', value: 'Widowed' }
  ];

  isSubmitted = false;
  currentStep = signal<number>(0);
  createdEmployeeId: number | null = null;
  wantsToCreateContract = signal<boolean>(false);

  constructor(
    private formBuilder: FormBuilder,
    private localisationService: LocalisationService,
    private employeeService: EmployeeService,
    private branchService: BranchService,
    private departmentService: DepartmentService,
    private jobService: JobService,
    private studyFieldService: StudyFieldService,
    private degreeService: DegreeService,

    private contractTypeService: ContractTypeService,
    private toastrService: ToastrService
  ) {
    this.initCreateForm();
  }

  ngOnChanges(): void {
    if (this.employeeToUpdate) {
      const quarter = this.employeeToUpdate.adress?.quarter;
      if (quarter) {
        this.filterRegions(quarter.town?.region?.countryID ?? 0);
        this.filterTowns(quarter.town?.regionID ?? 0);
        this.filterQuarters(quarter.townID ?? 0);
      }
      this.initEditForm(this.employeeToUpdate);
    } else {
      this.initCreateForm();
    }
    this.addEventListenerToLocationSearch();
  }

  async ngOnInit() {
    try {
      [
        this.countries,
        this.allTowns,
        this.allRegions,
        this.allQuarters,
        this.branches,
        this.departments,
        this.jobs,
        this.contractTypes,
        this.studyFields,
        this.degrees,

      ] = await Promise.all([
        firstValueFrom(this.localisationService.localisationControllerGetAllCountrys()),
        firstValueFrom(this.localisationService.localisationControllerGetAllTowns()),
        firstValueFrom(this.localisationService.localisationControllerGetAllRegions()),
        firstValueFrom(this.localisationService.localisationControllerGetAllQuarters()),
        firstValueFrom(this.branchService.branchControllerGetAllBranchs()),
        firstValueFrom(this.departmentService.departmentControllerGetAllDepartments()),
        firstValueFrom(this.jobService.jobControllerGetAllJobs()),

        firstValueFrom(this.contractTypeService.contractTypeControllerGetAllContractTypes()),
        firstValueFrom(this.studyFieldService.studyFieldControllerGetAllStudyFields()),
        firstValueFrom(this.degreeService.degreeControllerGetAllDegrees())
      ]);
    } catch (err) {
      this.toastrService.error('Failed to load form data');
      console.error(err);
    }
  }

  get form() {
    return this.employeeForm.controls;
  }

  async nextStep() {
    this.isSubmitted = true;

    // Step 0 - Personal Information
    if (this.currentStep() === 0) {
      const personalInfoValid = this.validatePersonalInfo();
      if (!personalInfoValid) {
        this.toastrService.error('Please fill all required fields in Personal Information');

        return;
      }
      this.isSubmitted = false;
      this.currentStep.set(1);
      return;
    }

    // Step 1 - Employment Information
    if (this.currentStep() === 1) {
      const employmentInfoValid = this.validateEmploymentInfo();
      if (!employmentInfoValid) {
        this.toastrService.error('Please fill all required fields in Employment Information');

        return;
      }
      this.isSubmitted = false;
      this.currentStep.set(2);
      return;
    }

    // Step 2 - Address Information
    if (this.currentStep() === 2) {
      const addressValid = this.validateAddress();
      if (!addressValid) {
        this.toastrService.error('Please fill all required fields in Address Information');

        return;
      }

      // Create or Update Employee
      if (!this.employeeToUpdate) {
        await this.createEmployee();
      } else {
        await this.updateEmployee();
      }

      this.isSubmitted = false;
      return;
    }

    // Step 3 - Contract (Optional)
    if (this.currentStep() === 3) {
      if (this.wantsToCreateContract()) {
        const contractValid = this.validateContract();
        if (!contractValid) {
          this.toastrService.error('Please fill all required fields in Contract Information');

          return;
        }
        await this.createContract();
      }
      this.isSubmitted = false;
      this.closePopup();
      return;
    }
  }

  prevStep() {
    if (this.currentStep() > 0) {
      this.currentStep.set(this.currentStep() - 1);
    }
  }

  validatePersonalInfo(): boolean {
    const name = this.employeeForm.get('name');
    const cni = this.employeeForm.get('cni');
    const sexId = this.employeeForm.get('sexId');
    const birthDate = this.employeeForm.get('birthDate');

    return !!(name?.valid && cni?.valid && sexId?.valid && birthDate?.valid);
  }

  validateEmploymentInfo(): boolean {
    const hireDate = this.employeeForm.get('hireDate');
    const branchId = this.employeeForm.get('branchId');
    const departmentId = this.employeeForm.get('departmentId');
    const jobId = this.employeeForm.get('jobId');

    const degreeId = this.employeeForm.get('degreeId');

    const studyFieldId = this.employeeForm.get('studyFieldId');

    return !!(hireDate?.valid && branchId?.valid && departmentId?.valid && jobId?.valid && degreeId?.valid && studyFieldId?.valid);
  }

  validateAddress(): boolean {
    const adressGroup = this.employeeForm.get('adress');
    return !!adressGroup?.valid;
  }

  validateContract(): boolean {
    const contractGroup = this.employeeForm.get('contract');
    return !!contractGroup?.valid;
  }

  async createEmployee() {
    const employeeDTO: EmployeeCreateBasicDTO = {
      globalPersonID: 0,
      name: this.form['name'].value,
      description: this.form['description'].value, // Ce sera le prénom
      cni: this.form['cni'].value,
      sexId: this.form['sexId'].value,
      studyFieldId: this.form['studyFieldId'].value,
      degreeId: this.form['degreeId'].value,
      birthDate: this.form['birthDate'].value,
      hireDate: this.form['hireDate'].value,
      branchId: this.form['branchId'].value,
      departmentId: this.form['departmentId'].value,
      jobId: this.form['jobId'].value,
      maritalStatus: this.form['maritalStatus'].value,
      childrenCount: this.form['childrenCount'].value,
      cnpsNumber: this.form['cnpsNumber'].value,
      adress: this.form['adress'].value,
    };

    try {
      const createdEmployee = await firstValueFrom(
        this.employeeService.employeeControllerCreateBasicEmployee(employeeDTO)
      );
      this.createdEmployeeId = createdEmployee.globalPersonID ?? null;
      this.toastrService.success('Employee created successfully');

      // Ask if user wants to create a contract
      this.currentStep.set(3);
    } catch (error) {
      this.toastrService.error('Failed to create employee');
      console.error(error);
      throw error;
    }
  }

  async updateEmployee() {

    this.isSubmitted = true;
    if (this.validateAddress() && this.validatePersonalInfo() && this.validateEmploymentInfo()) {



      const employeeDTO: EmployeeCreateBasicDTO = {
        globalPersonID: this.employeeToUpdate?.globalPersonID,
        name: this.form['name'].value,
        description: this.form['description'].value, // Ce sera le prénom
        cni: this.form['cni'].value,
        sexId: this.form['sexId'].value,
        studyFieldId: this.form['studyFieldId'].value,
        degreeId: this.form['degreeId'].value,
        birthDate: this.form['birthDate'].value,
        hireDate: this.form['hireDate'].value,
        branchId: this.form['branchId'].value,
        departmentId: this.form['departmentId'].value,
        jobId: this.form['jobId'].value,
        maritalStatus: this.form['maritalStatus'].value,
        childrenCount: this.form['childrenCount'].value,
        cnpsNumber: this.form['cnpsNumber'].value,
        adress: this.form['adress'].value,
      };

      try {
        await firstValueFrom(
          this.employeeService.employeeControllerUpdateEmployee(employeeDTO)
        );
        this.toastrService.success('Employee updated successfully');
        this.closePopup();
         this.isSubmitted = false;
      } catch (error) {
        this.toastrService.error('Failed to update employee');
        console.error(error);

      }
    }
  }

  async createContract() {
    if (!this.createdEmployeeId) {
      this.toastrService.error('No employee ID found');
      return;
    }

    const contractData = this.employeeForm.get('contract')?.value;
    const salaryData = this.employeeForm.get('contract.initialSalary')?.value;

    const contractDTO: ContractCreateDTO = {
      employeeId: this.createdEmployeeId,
      contractTypeId: contractData.contractTypeId,
      startDate: contractData.startDate,
      endDate: contractData.endDate,
      probationPeriodMonths: contractData.probationPeriodMonths,
      contractStatus: contractData.contractStatus,
      terms: contractData.terms,

      contractReference: contractData.contractReference,
      initialSalary: {
        baseSalary: salaryData.baseSalary,
        transportAllowance: salaryData.transportAllowance,
        housingAllowance: salaryData.housingAllowance,
        dutyAllowance: salaryData.dutyAllowance,
        riskAllowance: salaryData.riskAllowance,
        overtimeAllowance: salaryData.overtimeAllowance,
        functionAllowance: salaryData.functionAllowance,
        otherAllowances: salaryData.otherAllowances,
        changeReason: salaryData.changeReason,
        effectiveDate: salaryData.effectiveDate
      }
    };

    try {
      await firstValueFrom(
        this.employeeService.employeeControllerCreateContract(this.createdEmployeeId, contractDTO)
      );
      this.toastrService.success('Contract created successfully');
    } catch (error) {
      this.toastrService.error('Failed to create contract');
      console.error(error);
      throw error;
    }
  }

  skipContractCreation() {
    this.wantsToCreateContract.set(false);
    this.closePopup();
  }

  filterRegions(countryId: number) {
    this.regions = this.allRegions.filter((region) => region.countryID === countryId);
    this.employeeForm.get('adress.regionID')?.reset();
    this.employeeForm.get('adress.regionID')?.enable();
    this.employeeForm.get('adress.regionID')?.patchValue(null);
    this.employeeForm.get('adress.townID')?.reset();
    this.employeeForm.get('adress.townID')?.disable();
    this.employeeForm.get('adress.quarterID')?.reset();
    this.employeeForm.get('adress.quarterID')?.disable();
  }

  filterTowns(regionId: number) {
    this.towns = this.allTowns.filter((town) => town.regionID === regionId);
    this.employeeForm.get('adress.townID')?.reset();
    this.employeeForm.get('adress.townID')?.enable();
    this.employeeForm.get('adress.townID')?.patchValue(null);
    this.employeeForm.get('adress.quarterID')?.reset();
    this.employeeForm.get('adress.quarterID')?.disable();
  }

  filterQuarters(townId: number) {
    this.quarters = this.allQuarters.filter((quarter) => quarter.townID === townId);
    this.employeeForm.get('adress.quarterID')?.reset();
    this.employeeForm.get('adress.quarterID')?.enable();
    this.employeeForm.get('adress.quarterID')?.patchValue(null);
  }

  addEventListenerToLocationSearch() {
    this.employeeForm.get('adress.countryID')?.valueChanges.subscribe((countryId) => {
      this.filterRegions(countryId);
    });
    this.employeeForm.get('adress.regionID')?.valueChanges.subscribe((regionId) => {
      this.filterTowns(regionId);
    });
    this.employeeForm.get('adress.townID')?.valueChanges.subscribe((townId) => {
      this.filterQuarters(townId);
    });
  }

  initCreateForm() {
    this.employeeForm = this.formBuilder.group({
      globalPersonID: [0],
      name: [null, Validators.required],
      description: [null, Validators.required], // Prénom
      cni: [null, Validators.required],
      sexId: [null, Validators.required],
      birthDate: [null, Validators.required],
      hireDate: [null, Validators.required],
      branchId: [null, Validators.required],
      departmentId: [null, Validators.required],
      jobId: [null, Validators.required],
      studyFieldId: [null, Validators.required],
      degreeId: [null, Validators.required],
      maritalStatus: [null],
      childrenCount: [0],
      cnpsNumber: [null],
      adress: this.formBuilder.group({
        adressPhoneNumber: [null, Validators.required],
        adressCellNumber: [null],
        adressFullName: [null],
        adressEmail: [null, [Validators.required, Validators.email]],
        adressWebSite: [null],
        adressPOBox: [null],
        adressFax: [null],
        countryID: [null, Validators.required],
        regionID: [{ value: null, disabled: true }, Validators.required],
        townID: [{ value: null, disabled: true }, Validators.required],
        quarterID: [{ value: null, disabled: true }, Validators.required],
      }),
      contract: this.formBuilder.group({
        contractTypeId: [null, Validators.required],
        startDate: [null, Validators.required],
        endDate: [null],
        probationPeriodMonths: [null],
        contractStatus: [0],
        terms: [null],
        contractReference: [null],
        initialSalary: this.formBuilder.group({
          baseSalary: [null, [Validators.required, Validators.min(0)]],
          transportAllowance: [0],
          housingAllowance: [0],
          dutyAllowance: [0],
          riskAllowance: [0],
          overtimeAllowance: [0],
          functionAllowance: [0],
          otherAllowances: [0],
          changeReason: ['Initial Contract'],
          effectiveDate: [null, Validators.required]
        })
      })
    });
  }

  initEditForm(employee: EmployeeModel) {
    const quarter = employee.adress?.quarter;
    this.employeeForm = this.formBuilder.group({
      globalPersonID: [employee.globalPersonID],
      name: [employee.name, Validators.required],
      description: [employee.description, Validators.required], // Prénom
      cni: [employee.cni, Validators.required],
      sexId: [employee.sexId, Validators.required],
      birthDate: [employee.birthDate, Validators.required],
      hireDate: [employee.hireDate, Validators.required],
      branchId: [employee.branchId, Validators.required],
      departmentId: [employee.departmentId, Validators.required],
      jobId: [employee.jobId, Validators.required],
      studyFieldId: [employee.studyFieldId, Validators.required],
      degreeId: [employee.degreeId, Validators.required],
      maritalStatus: [employee.maritalStatus],
      childrenCount: [employee.childrenCount || 0],
      cnpsNumber: [employee.cnpsNumber],
      adress: this.formBuilder.group({
        adressID: [employee.adress?.adressID],
        adressPhoneNumber: [employee.adress?.adressPhoneNumber, Validators.required],
        adressCellNumber: [employee.adress?.adressCellNumber],
        adressFullName: [employee.adress?.adressFullName],
        adressEmail: [employee.adress?.adressEmail, [Validators.required, Validators.email]],
        adressWebSite: [employee.adress?.adressWebSite],
        adressPOBox: [employee.adress?.adressPOBox],
        adressFax: [employee.adress?.adressFax],
        countryID: [quarter?.town?.region?.countryID, Validators.required],
        regionID: [{ value: quarter?.town?.regionID, disabled: false }, Validators.required],
        townID: [{ value: quarter?.townID, disabled: false }, Validators.required],
        quarterID: [{ value: employee.adress?.quarterID, disabled: false }, Validators.required],
      }),
      contract: this.formBuilder.group({
        contractTypeId: [null],
        startDate: [null],
        endDate: [null],
        probationPeriodMonths: [null],
        contractStatus: ['Active'],
        terms: [null],
        contractReference: [null],
        initialSalary: this.formBuilder.group({
          baseSalary: [null],
          transportAllowance: [0],
          housingAllowance: [0],
          dutyAllowance: [0],
          riskAllowance: [0],
          overtimeAllowance: [0],
          functionAllowance: [0],
          otherAllowances: [0],
          changeReason: ['Initial Contract'],
          effectiveDate: [null]
        })
      })
    });
  }

  closePopup() {
    closeModal('employee-create-form');
    this.currentStep.set(0);
    this.createdEmployeeId = null;
    this.wantsToCreateContract.set(false);

  }

  steps = [
    { position: 0, subtitle: 'Personal Information' },
    { position: 1, subtitle: 'Employment Information' },
    { position: 2, subtitle: 'Address Information' },
    { position: 3, subtitle: 'Contract (Optional)' }
  ];
}

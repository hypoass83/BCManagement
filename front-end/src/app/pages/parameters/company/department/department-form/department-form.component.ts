

import { CompanyModel, CountryModel, DepartmentModel, DepartmentService, LocalisationService, RegionModel, CompanyService } from 'src/app/generated';

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { firstValueFrom } from 'rxjs';
import { closeModal } from 'src/app/helper/helper-function';



@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.scss'],
})
export class DepartmentsFormComponent implements OnInit, OnChanges {


  @Input() departmentToUpdate: DepartmentModel | null = null;

  @Input() rowData: DepartmentModel[] = [];

  @Output() rowDataChange = new EventEmitter<DepartmentModel[]>(); // Prepare to emit changes

  public departmentForm!: FormGroup;
  public error = '';

  isSubmitted = false;

  companies : CompanyModel[] = []

  constructor(private formBuilder: FormBuilder, private CompanyService: CompanyService,private departmentService : DepartmentService) {
    this.initCreateForm();
  }

  ngOnChanges(): void {

    if (this.departmentToUpdate) {

      this.initEditForm(this.departmentToUpdate)

    } else {
      this.initCreateForm();
    }

  }

  async ngOnInit() {

   this.companies = await firstValueFrom(this.CompanyService.companyControllerGetAllCompanies());

  }




  get form() {
    return this.departmentForm.controls;
  }

  async createOrUpdateDepartment() {

    this.isSubmitted = true;
    if (this.departmentForm.valid) {

      const DepartmentModel: DepartmentModel = {
        departmentID: this.form['departmentID']?.value,
        departmentCode: this.form['departmentCode'].value,
        departmentName: this.form['departmentName'].value,
        departmentDescription: this.form['departmentDescription'].value,
        companyID :this.form['companyID'].value,
      }

      try {
        if (this.departmentToUpdate) {
          const newDepartment = await firstValueFrom(this.departmentService.departmentControllerUpdateDepartment(DepartmentModel));
          if (newDepartment) {
            const index = this.rowData.findIndex(u => u.departmentID === this.departmentToUpdate?.departmentID);
            if (index !== -1) {
              this.rowData[index] = newDepartment;
            }
          }
        } else {
          const newDepartment = await firstValueFrom(this.departmentService.departmentControllerCreateDepartment(DepartmentModel));
          if (newDepartment) {
            this.rowData.push(newDepartment);
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
    this.departmentForm = this.formBuilder.group({
      departmentCode: [null, Validators.required],
      departmentName: [null, Validators.required],
      departmentDescription: [null, Validators.required],
      companyID: [null, Validators.required],
    });
  }


  initEditForm(Department: DepartmentModel) {
    this.departmentForm = this.formBuilder.group({
      departmentID: [Department.departmentID],
      departmentCode: [Department.departmentCode, Validators.required],
      departmentName: [Department.departmentName, Validators.required],
      departmentDescription: [Department.departmentDescription, Validators.required],
      companyID: [Department.companyID, Validators.required],
    });
  }

  closePopup() {
    closeModal('departement-create-form')
  }

}

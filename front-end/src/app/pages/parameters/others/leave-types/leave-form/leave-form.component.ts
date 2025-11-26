import { DepartmentService } from './../../../../../generated/api/department.service';

import { CountryModel, DepartmentModel, LeaveTypeService, LocalisationService, RegionModel } from 'src/app/generated';

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveTypeModel } from 'src/app/generated';
import { firstValueFrom } from 'rxjs';
import { closeModal } from 'src/app/helper/helper-function';



@Component({
  selector: 'app-leave-form',
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.scss'],
})
export class LeaveTypesFormComponent implements OnInit, OnChanges {


  @Input() leaveTypeToUpdate: LeaveTypeModel | null = null;

  @Input() rowData: LeaveTypeModel[] = [];

  @Output() rowDataChange = new EventEmitter<LeaveTypeModel[]>(); // Prepare to emit changes

  public leaveTypeForm!: FormGroup;
  public error = '';

  isSubmitted = false;



  constructor(private formBuilder: FormBuilder, private LeaveTypeService: LeaveTypeService) {
    this.initCreateForm();
  }

  ngOnChanges(): void {

    if (this.leaveTypeToUpdate) {

      this.initEditForm(this.leaveTypeToUpdate)

    } else {
      this.initCreateForm();
    }

  }

  async ngOnInit() {


  }




  get form() {
    return this.leaveTypeForm.controls;
  }

  async createOrUpdateLeaveType() {

    this.isSubmitted = true;
    if (this.leaveTypeForm.valid) {

      const LeaveTypeModel: LeaveTypeModel = {
        leaveTypeID: this.form['leaveTypeID']?.value,
        code: this.form['code'].value,
        name: this.form['name'].value,
        isPaid: this.form['isPaid'].value,
        defaultDurationDays: this.form['defaultDurationDays'].value,
        description: this.form['description'].value,
      }

      try {
        if (this.leaveTypeToUpdate) {
          const newLeaveType = await firstValueFrom(this.LeaveTypeService.leaveTypeControllerUpdateLeaveType(LeaveTypeModel));
          if (newLeaveType) {
            const index = this.rowData.findIndex(u => u.leaveTypeID === this.leaveTypeToUpdate?.leaveTypeID);
            if (index !== -1) {
              this.rowData[index] = newLeaveType;
            }
          }
        } else {
          const newLeaveType = await firstValueFrom(this.LeaveTypeService.leaveTypeControllerCreateLeaveType(LeaveTypeModel));
          if (newLeaveType) {
            this.rowData.push(newLeaveType);
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
    this.leaveTypeForm = this.formBuilder.group({
      code: [null, Validators.required],
      name: [null, Validators.required],
      isPaid: [null],
      defaultDurationDays: [null, Validators.required],
      description: [null, Validators.required],
    });
  }


  initEditForm(LeaveType: LeaveTypeModel) {

    this.leaveTypeForm = this.formBuilder.group({
      leaveTypeID: [LeaveType.leaveTypeID],
      code: [LeaveType.code, Validators.required],
      name: [LeaveType.name, Validators.required],
      isPaid: [LeaveType.isPaid],
      defaultDurationDays: [LeaveType.defaultDurationDays, Validators.required],
      description: [LeaveType.description, , Validators.required],
    });
  }

  closePopup() {
    closeModal('leave-type-create-form')
  }

}

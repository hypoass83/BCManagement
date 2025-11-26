import { DepartmentService } from './../../../../../generated/api/department.service';

import { CountryModel, DepartmentModel, JobService, LocalisationService, RegionModel } from 'src/app/generated';

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobModel } from 'src/app/generated';
import { firstValueFrom } from 'rxjs';
import { closeModal } from 'src/app/helper/helper-function';



@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss'],
})
export class JobsFormComponent implements OnInit, OnChanges {


  @Input() jobToUpdate: JobModel | null = null;

  @Input() rowData: JobModel[] = [];

  @Output() rowDataChange = new EventEmitter<JobModel[]>(); // Prepare to emit changes

  public jobForm!: FormGroup;
  public error = '';

  isSubmitted = false;

  departments : DepartmentModel[] = []

  constructor(private formBuilder: FormBuilder, private jobService: JobService,private departmentService : DepartmentService) {
    this.initCreateForm();
  }

  ngOnChanges(): void {

    if (this.jobToUpdate) {

      this.initEditForm(this.jobToUpdate)

    } else {
      this.initCreateForm();
    }

  }

  async ngOnInit() {

   this.departments = await firstValueFrom(this.departmentService.departmentControllerGetAllDepartments());

  }




  get form() {
    return this.jobForm.controls;
  }

  async createOrUpdateJob() {

    this.isSubmitted = true;
    if (this.jobForm.valid) {

      const JobModel: JobModel = {
        jobID: this.form['jobID']?.value,
        jobCode: this.form['jobCode'].value,
        jobLabel: this.form['jobLabel'].value,
        jobDescription: this.form['jobDescription'].value,
        departmentID :this.form['departmentID'].value,
      }

      try {
        if (this.jobToUpdate) {
          const newJob = await firstValueFrom(this.jobService.jobControllerUpdateJob(JobModel));
          if (newJob) {
            const index = this.rowData.findIndex(u => u.jobID === this.jobToUpdate?.jobID);
            if (index !== -1) {
              this.rowData[index] = newJob;
            }
          }
        } else {
          const newJob = await firstValueFrom(this.jobService.jobControllerCreateJob(JobModel));
          if (newJob) {
            this.rowData.push(newJob);
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
    this.jobForm = this.formBuilder.group({
      jobCode: [null, Validators.required],
      jobLabel: [null, Validators.required],
      jobDescription: [null, Validators.required],
      departmentID: [null, Validators.required],
    });
  }


  initEditForm(Job: JobModel) {
    this.jobForm = this.formBuilder.group({
      jobID: [Job.jobID],
      jobCode: [Job.jobCode, Validators.required],
      jobLabel: [Job.jobLabel, Validators.required],
      jobDescription: [Job.jobDescription, Validators.required],
      departmentID: [Job.departmentID, Validators.required],
    });
  }

  closePopup() {
    closeModal('job-create-form')
  }

}

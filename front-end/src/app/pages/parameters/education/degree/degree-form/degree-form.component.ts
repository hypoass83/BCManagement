import { DepartmentService } from './../../../../../generated/api/department.service';

import { CountryModel, DepartmentModel, DegreeService, LocalisationService, RegionModel } from 'src/app/generated';

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DegreeModel } from 'src/app/generated';
import { firstValueFrom } from 'rxjs';
import { closeModal } from 'src/app/helper/helper-function';



@Component({
  selector: 'app-degree-form',
  templateUrl: './degree-form.component.html',
  styleUrls: ['./degree-form.component.scss'],
})
export class DegreesFormComponent implements OnInit, OnChanges {


  @Input() degreeToUpdate: DegreeModel | null = null;

  @Input() rowData: DegreeModel[] = [];

  @Output() rowDataChange = new EventEmitter<DegreeModel[]>(); // Prepare to emit changes

  public degreeForm!: FormGroup;
  public error = '';

  isSubmitted = false;



  constructor(private formBuilder: FormBuilder, private DegreeService: DegreeService) {
    this.initCreateForm();
  }

  ngOnChanges(): void {

    if (this.degreeToUpdate) {

      this.initEditForm(this.degreeToUpdate)

    } else {
      this.initCreateForm();
    }

  }

  async ngOnInit() {


  }




  get form() {
    return this.degreeForm.controls;
  }

  async createOrUpdateDegree() {

    this.isSubmitted = true;
    if (this.degreeForm.valid) {

      const DegreeModel: DegreeModel = {
        degreeID: this.form['degreeID']?.value,
        degreeName: this.form['degreeName'].value,
        degreeDescription: this.form['degreeDescription'].value,
      }

      try {
        if (this.degreeToUpdate) {
          const newDegree = await firstValueFrom(this.DegreeService.degreeControllerUpdateDegree(DegreeModel));
          if (newDegree) {
            const index = this.rowData.findIndex(u => u.degreeID === this.degreeToUpdate?.degreeID);
            if (index !== -1) {
              this.rowData[index] = newDegree;
            }
          }
        } else {
          const newDegree = await firstValueFrom(this.DegreeService.degreeControllerCreateDegree(DegreeModel));
          if (newDegree) {
            this.rowData.push(newDegree);
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
    this.degreeForm = this.formBuilder.group({
      degreeName: [null, Validators.required],
      degreeDescription: [null, Validators.required],
    });
  }


  initEditForm(Degree: DegreeModel) {
    this.degreeForm = this.formBuilder.group({
      degreeID: [Degree.degreeID],
      degreeName: [Degree.degreeName, Validators.required],
      degreeDescription: [Degree.degreeDescription, Validators.required],

    });
  }

  closePopup() {
    closeModal('Degree-create-form')
  }

}

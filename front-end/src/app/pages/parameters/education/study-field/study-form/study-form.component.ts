import { DepartmentService } from './../../../../../generated/api/department.service';

import { CountryModel, DepartmentModel, StudyFieldService, LocalisationService, RegionModel } from 'src/app/generated';

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudyFieldModel } from 'src/app/generated';
import { firstValueFrom } from 'rxjs';
import { closeModal } from 'src/app/helper/helper-function';



@Component({
  selector: 'app-study-form',
  templateUrl: './study-form.component.html',
  styleUrls: ['./study-form.component.scss'],
})
export class StudyFieldsFormComponent implements OnInit, OnChanges {


  @Input() studyFieldToUpdate: StudyFieldModel | null = null;

  @Input() rowData: StudyFieldModel[] = [];

  @Output() rowDataChange = new EventEmitter<StudyFieldModel[]>(); // Prepare to emit changes

  public studyFieldForm!: FormGroup;
  public error = '';

  isSubmitted = false;



  constructor(private formBuilder: FormBuilder, private StudyFieldService: StudyFieldService) {
    this.initCreateForm();
  }

  ngOnChanges(): void {

    if (this.studyFieldToUpdate) {

      this.initEditForm(this.studyFieldToUpdate)

    } else {
      this.initCreateForm();
    }

  }

  async ngOnInit() {


  }




  get form() {
    return this.studyFieldForm.controls;
  }

  async createOrUpdateStudyField() {

    this.isSubmitted = true;
    if (this.studyFieldForm.valid) {

      const StudyFieldModel: StudyFieldModel = {
        studyFieldID: this.form['studyFieldID']?.value,
        fieldName: this.form['fieldName'].value,
        fieldDescription: this.form['fieldDescription'].value,
      }

      try {
        if (this.studyFieldToUpdate) {
          const newStudyField = await firstValueFrom(this.StudyFieldService.studyFieldControllerUpdateStudyField(StudyFieldModel));
          if (newStudyField) {
            const index = this.rowData.findIndex(u => u.studyFieldID === this.studyFieldToUpdate?.studyFieldID);
            if (index !== -1) {
              this.rowData[index] = newStudyField;
            }
          }
        } else {
          const newStudyField = await firstValueFrom(this.StudyFieldService.studyFieldControllerCreateStudyField(StudyFieldModel));
          if (newStudyField) {
            this.rowData.push(newStudyField);
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
    this.studyFieldForm = this.formBuilder.group({
      fieldName: [null, Validators.required],
      fieldDescription : [null, Validators.required],
    });
  }


  initEditForm(StudyField: StudyFieldModel) {
    this.studyFieldForm = this.formBuilder.group({
      studyFieldID: [StudyField.studyFieldID],
      fieldName: [StudyField.fieldName, Validators.required],
      fieldDescription: [StudyField.fieldDescription, Validators.required],

    });
  }

  closePopup() {
    closeModal('field-create-form')
  }

}

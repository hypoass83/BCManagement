import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
})
export class FormInputComponent {
  @Input() form!: FormGroup;
  @Input() controlName!: string;
  @Input() label!: string;
  @Input() inputType: string = 'text';
  @Input() placeholder?: string;
  @Input() required: boolean = false;
  @Input() submitted: boolean = false;

   uniqueId = Math.random().toString(36).substring(2, 9);

  get control(): FormControl {

    return this.form.get(this.controlName) as FormControl;
  }
}

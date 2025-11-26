import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-select',
  templateUrl: './form-select.component.html',
})
export class FormSelectComponent {
  @Input() form!: FormGroup;
  @Input() controlName!: string;
  @Input() label!: string;
  @Input() options: any[] = [];
  @Input() optionLabel!: string;
  @Input() optionValue!: string;
  @Input() placeholder = 'Select an option';
  @Input() required = false;
  @Input() submitted = false;

  get formControl() {
    return this.form.get(this.controlName);
  }
}

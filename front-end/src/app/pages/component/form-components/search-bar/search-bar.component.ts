import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',

})
export class SearchBarComponent {
  @Input() quickFilterText: string = '';
  @Input() buttonLabel: string = 'Action';

  @Output() quickFilterTextChange = new EventEmitter<string>();
  @Output() buttonClick = new EventEmitter<void>();

  onInputChange(value: string) {
    this.quickFilterTextChange.emit(value);
  }

  onButtonClick() {
    this.buttonClick.emit();
  }
}

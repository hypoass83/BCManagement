import { Component } from '@angular/core';
import * as switcher from '../../../shared/components/switcher/switcher'; 
@Component({
  selector: 'app-custom-layout',
  templateUrl: './custom-layout.component.html',
  styleUrls: ['./custom-layout.component.scss']
})
export class CustomLayoutComponent {
  constructor() {
    switcher.localStorageBackUp();
  }
}

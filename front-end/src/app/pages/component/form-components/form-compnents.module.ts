import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgApexchartsModule } from 'ng-apexcharts';
// import { NgChartsModule } from 'ng2-charts';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedModule } from 'src/app/shared/sharedmodule';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgSelectModule } from '@ng-select/ng-select';

import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormInputComponent } from './form-input/form-input.component';
import { FormSelectComponent } from './form-select/form-select.component';
import { MaterialModuleModule } from 'src/app/materialModule/material-module/material-module.module';
import { DpDatePickerModule } from 'ng2-date-picker';
import { ModalComponent } from '../modal/modal.component';
import { SearchBarComponent } from './search-bar/search-bar.component';

@NgModule({
  declarations: [

    FormInputComponent,
    FormSelectComponent,
    ModalComponent,
    SearchBarComponent
  ],
  imports: [
    CommonModule,

    NgApexchartsModule,
    CarouselModule,
    SharedModule,
    FormsModule,
    NgxChartsModule,
    NgSelectModule,
    AgGridModule,
    ReactiveFormsModule,
    DpDatePickerModule,
    MaterialModuleModule,
    NgxDropzoneModule,

  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormInputComponent,
    FormSelectComponent,
    ModalComponent,
    SearchBarComponent
  ]
})
export class FormCompentModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgApexchartsModule } from 'ng-apexcharts';

import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedModule } from 'src/app/shared/sharedmodule';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgSelectModule } from '@ng-select/ng-select';

import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslocoRootModule } from 'src/app/transloco-root.module';
import { FormCompentModule } from '../component/form-components/form-compnents.module';
import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeesComponent } from './employees/employee.component';
import { EmployeesFormComponent } from './employees/employee-form/employee-form.component';
import { TransferFormComponent } from './transfers/transfers-form/transfer-form.component';
import { TransferComponent } from './transfers/transfer.component';
import { EmployeeJourneyComponent } from './employee-journey/employee-journey.component';

@NgModule({
  declarations: [
    EmployeesComponent,
    EmployeesFormComponent,
    TransferFormComponent,
    TransferComponent,
    EmployeeJourneyComponent,
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    NgApexchartsModule,
    CarouselModule,
    SharedModule,
    NgxChartsModule,
    NgSelectModule,
    FormsModule,
    AgGridModule,
    ReactiveFormsModule,
    TranslocoRootModule,
    FormCompentModule
  ],
})
export class EmployeeModule { }

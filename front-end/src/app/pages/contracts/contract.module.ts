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
import { ContractRoutingModule } from './contract-routing.module';
import { ContractsComponent } from './contracts/contract.component';
import { ContractsFormComponent } from './contracts/contract-form/contract-form.component';


@NgModule({
  declarations: [
    ContractsComponent,
    ContractsFormComponent
  ],
  imports: [
    CommonModule,
    ContractRoutingModule,
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
export class ContractModule { }

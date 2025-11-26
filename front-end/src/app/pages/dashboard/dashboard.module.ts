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
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgApexchartsModule,
    CarouselModule,
    SharedModule,
    NgxChartsModule,
    NgSelectModule,
    FormsModule,
    AgGridModule,
    ReactiveFormsModule,
    TranslocoRootModule,
  ],
})
export class DashboardModule { }

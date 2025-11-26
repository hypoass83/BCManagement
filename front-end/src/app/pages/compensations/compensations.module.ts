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
import { CompasationRoutingModule } from './compensations-routing.module';
import { LoanListComponent } from './loans/loan-list.component';
import { LoanFormComponent } from './loans/loan-form/loan-form.component';
import { LoanPaymentFormComponent } from './loans/loan-payment/loan-payment-form.component';
import { BonusListComponent } from './bonus/bonus-list.component';
import { BonusFormComponent } from './bonus/bonus-form/bonus-form.component';
import { SalaryRevisionListComponent } from './salary-revisits/salary-revision-list.component';
import { SalaryRevisionFormComponent } from './salary-revisits/salary-revision-form/salary-revision-form.component';
import { CertificationListComponent } from './certification/certification-list.component';
import { CertificationFormComponent } from './certification/certification-form/certification-form.component';


@NgModule({
  declarations: [
    LoanListComponent,
    LoanFormComponent,
    LoanPaymentFormComponent,
    BonusListComponent,
    BonusFormComponent,
    SalaryRevisionListComponent,
    SalaryRevisionFormComponent,
    CertificationListComponent,
    CertificationFormComponent
  ],
  imports: [
    CommonModule,
    CompasationRoutingModule,
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
export class CompasentionModule { }

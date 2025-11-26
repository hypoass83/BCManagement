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
import { TimeActivityRoutingModule } from './time-activities-routing.module';
import { MissionListComponent } from './mission/mission-list.component';
import { MissionFormComponent } from './mission/mission-form/mission-form.component';
import { LeaveFormComponent } from './leave/leave-form/leave-form.component';
import { LeaveListComponent } from './leave/leave-list.component';
import { SanctionFormComponent } from './sanctions/sanction-form/sanction-form.component';
import { SanctionListComponent } from './sanctions/sanction-list.component';


@NgModule({
  declarations: [
    MissionListComponent,
    MissionFormComponent,
    LeaveFormComponent,
    LeaveListComponent,
    SanctionFormComponent,
    SanctionListComponent,

  ],
  imports: [
    CommonModule,
    TimeActivityRoutingModule,
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
export class TimeActivityModule { }

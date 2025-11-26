import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgApexchartsModule } from 'ng-apexcharts';

import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedModule } from 'src/app/shared/sharedmodule';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgSelectModule } from '@ng-select/ng-select';
import { UsersComponent } from './users/users.component';
import { SecurityRoutingModule } from './security-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileListComponent } from './profile/profile-list/profile.component';
import { CreateProfilesComponent } from './profile/profile-list/create-profiles/create-profiles.component';
import { AdvancedProfileComponent } from './profile/advanced-profile/advanced-profile.component';
import { UpdateActionProfileComponent } from './profile/advanced-profile/update-action-profile/update-action-profile.component';
import { UsersFormComponent } from './users/user-form/user-form.component';
import { TranslocoRootModule } from 'src/app/transloco-root.module';
import { FormCompentModule } from '../component/form-components/form-compnents.module';
@NgModule({
  declarations: [
    UsersComponent,
    UsersFormComponent,
    ProfileListComponent,
    CreateProfilesComponent,
    AdvancedProfileComponent,
    UpdateActionProfileComponent
  ],
  imports: [
    CommonModule,
    SecurityRoutingModule,

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
export class SecurityModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfilesettingsComponent } from './profilesettings/profilesettings.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DpDatePickerModule } from "ng2-date-picker";
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/sharedmodule';
import { MaterialModuleModule } from 'src/app/materialModule/material-module/material-module.module';
import { LightboxModule } from 'ng-gallery/lightbox';
import { GalleryModule } from '@ks89/angular-modal-gallery';
@NgModule({
  declarations: [ ProfilesettingsComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    NgxDaterangepickerMd.forRoot(),
    FormsModule,
    DpDatePickerModule,
    NgSelectModule,
    SharedModule,
    MaterialModuleModule,
    GalleryModule,
    LightboxModule,

    CommonModule,

    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ProfileModule {}

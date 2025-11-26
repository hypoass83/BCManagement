import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProfilesettingsComponent } from './profilesettings/profilesettings.component';

const routes: Routes = [

  {path:"profile/profilesettings",component:ProfilesettingsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { ProfileListComponent } from './profile/profile-list/profile.component';
import { CreateProfilesComponent } from './profile/profile-list/create-profiles/create-profiles.component';
import { AdvancedProfileComponent } from './profile/advanced-profile/advanced-profile.component';
import { UpdateActionProfileComponent } from './profile/advanced-profile/update-action-profile/update-action-profile.component';
const routes: Routes = [

  {
    path: "",
    children: [
      { path: "admin/users", component: UsersComponent},
      { path: "admin/profile/base", component: ProfileListComponent},
      {path:"admin/profile-form/:id",component:CreateProfilesComponent},
      {path:"admin/profile-form",component:CreateProfilesComponent},
      {path:"admin/profile/advanced",component:AdvancedProfileComponent},
      {path:"admin/profile/advanced/edit/:id",component:UpdateActionProfileComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MissionListComponent } from './mission/mission-list.component';
import { LeaveListComponent } from './leave/leave-list.component';
import { SanctionListComponent } from './sanctions/sanction-list.component';



const routes: Routes = [

  {
    path: "",
    children: [
      { path: "time/missions", component: MissionListComponent},

      { path: "time/leaves", component: LeaveListComponent},
       { path: "time/sanctions", component: SanctionListComponent},




    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeActivityRoutingModule { }

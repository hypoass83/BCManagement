import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanListComponent } from './loans/loan-list.component';
import { BonusFormComponent } from './bonus/bonus-form/bonus-form.component';
import { BonusListComponent } from './bonus/bonus-list.component';
import { SalaryRevisionFormComponent } from './salary-revisits/salary-revision-form/salary-revision-form.component';
import { SalaryRevisionListComponent } from './salary-revisits/salary-revision-list.component';
import { CertificationTypeListComponent } from '../parameters/others/certification-type/certification-type-list.component';
import { CertificationListComponent } from './certification/certification-list.component';



const routes: Routes = [

  {
    path: "",
    children: [
      { path: "compensation/loans", component: LoanListComponent },

      { path: "compensation/bonus-employee", component: BonusListComponent },

      { path: "compensation/salary-revisit", component: SalaryRevisionListComponent },

      { path: "compensation/certification", component: CertificationListComponent },



    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompasationRoutingModule { }

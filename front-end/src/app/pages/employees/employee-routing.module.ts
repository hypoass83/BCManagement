import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './employees/employee.component';
import { TransferComponent } from './transfers/transfer.component';
import { EmployeeJourneyComponent } from './employee-journey/employee-journey.component';

const routes: Routes = [

  {
    path: "",
    children: [
      { path: "personnel/employees/list", component: EmployeesComponent },

      { path: "personnel/report/journey", component: EmployeeJourneyComponent },
      { path: "personnel/employees/transfers", component: TransferComponent },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }

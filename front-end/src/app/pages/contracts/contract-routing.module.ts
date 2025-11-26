import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractsComponent } from './contracts/contract.component';


const routes: Routes = [

  {
    path: "",
    children: [
      { path: "contracts/management", component: ContractsComponent},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractRoutingModule { }

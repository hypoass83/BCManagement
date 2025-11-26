import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractPrintComponent } from './contracts/contract-print.component';

const routes: Routes = [

  {
    path: "",
    children: [
      { path: "receipt/contract/:id", component: ContractPrintComponent },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecieptRoutingModule { }

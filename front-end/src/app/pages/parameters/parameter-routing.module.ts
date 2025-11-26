import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchsComponent } from './company/branchs/branch.component';
import { JobsComponent } from './company/job/job.component';
import { CompaniesComponent } from './company/companies/company.component';
import { CountriesComponent } from './localization/country/country.component';
import { RegionsComponent } from './localization/region/region.component';
import { TownsComponent } from './localization/town/town.component';
import { QuartersComponent } from './localization/quarter/quarter.component';
import { DepartmentsComponent } from './company/department/department.component';
import { DegreesComponent } from './education/degree/degree.component';
import { StudyFieldsComponent } from './education/study-field/study.component';
import { TaxeContributionsComponent } from './taxes/taxes/taxe.component';
import { LeaveTypesComponent } from './others/leave-types/leave.component';
import { CertificationTypeListComponent } from './others/certification-type/certification-type-list.component';
import { ContractTypeListComponent } from './others/contract-types/contract-type-list.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'config/company/agencies', component: BranchsComponent },
      { path: 'config/company/jobs', component: JobsComponent },
      { path: 'config/company/companies', component: CompaniesComponent },
      { path: "config/company/departments", component: DepartmentsComponent },

      { path: "config/locality/country", component: CountriesComponent },
      { path: "config/locality/region", component: RegionsComponent },
      { path: "config/locality/town", component: TownsComponent },
      { path: "config/locality/quarter", component: QuartersComponent },

      { path: "config/education/diplome", component: DegreesComponent },
      { path: "config/education/study-field", component: StudyFieldsComponent },
      { path: "config/tax", component: TaxeContributionsComponent },
      { path: "config/leaves-type", component: LeaveTypesComponent },
      { path: "config/contract-type", component: ContractTypeListComponent },

      { path: "config/certification-type", component: CertificationTypeListComponent },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParameterRoutingModule { }

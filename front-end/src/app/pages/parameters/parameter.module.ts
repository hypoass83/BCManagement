import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgApexchartsModule } from 'ng-apexcharts';
// import { NgChartsModule } from 'ng2-charts';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedModule } from 'src/app/shared/sharedmodule';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgSelectModule } from '@ng-select/ng-select';


import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BranchsComponent } from './company/branchs/branch.component';
import { BranchsFormComponent } from './company/branchs/branch-form/branch-form.component';
import { TranslocoModule } from '@ngneat/transloco';
import { JobsComponent } from './company/job/job.component';
import { JobsFormComponent } from './company/job/job-form/job-form.component';

import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormCompentModule } from '../component/form-components/form-compnents.module';
import { CompaniesComponent } from './company/companies/company.component';
import { CompanyFormComponent } from './company/companies/company-form/company-form.component';
import { CountriesComponent } from './localization/country/country.component';
import { CountriesFormComponent } from './localization/country/country-form/country-form.component';
import { RegionsComponent } from './localization/region/region.component';
import { RegionsFormComponent } from './localization/region/region-form/region-form.component';
import { TownsComponent } from './localization/town/town.component';
import { TownsFormComponent } from './localization/town/town-form/town-form.component';
import { QuartersComponent } from './localization/quarter/quarter.component';
import { QuartersFormComponent } from './localization/quarter/quarter-form/quarter-form.component';
import { ParameterRoutingModule } from './parameter-routing.module';
import { DepartmentsFormComponent } from './company/department/department-form/department-form.component';
import { DepartmentsComponent } from './company/department/department.component';
import { DegreesFormComponent } from './education/degree/degree-form/degree-form.component';
import { DegreesComponent } from './education/degree/degree.component';
import { StudyFieldsComponent } from './education/study-field/study.component';
import { StudyFieldsFormComponent } from './education/study-field/study-form/study-form.component';
import { TaxeContributionsFormComponent } from './taxes/taxes/taxe-form/taxe-form.component';
import { TaxeContributionsComponent } from './taxes/taxes/taxe.component';
import { LeaveTypesFormComponent } from './others/leave-types/leave-form/leave-form.component';
import { LeaveTypesComponent } from './others/leave-types/leave.component';
import { CertificationTypeFormComponent } from './others/certification-type/certification-type-form/certification-type-form.component';
import { CertificationTypeListComponent } from './others/certification-type/certification-type-list.component';
import { ContractTypeFormComponent } from './others/contract-types/contract-type-form/contract-type-form.component';
import { ContractTypeListComponent } from './others/contract-types/contract-type-list.component';

@NgModule({
  declarations: [
    BranchsComponent,
    BranchsFormComponent,
    JobsComponent,
    JobsFormComponent,
    CompaniesComponent,
    CompanyFormComponent,
    CountriesComponent,
    CountriesFormComponent,
    RegionsComponent,
    RegionsFormComponent,
    TownsComponent,
    TownsFormComponent,
    QuartersComponent,
    QuartersFormComponent,
    DepartmentsFormComponent,
    DepartmentsComponent,
    DegreesFormComponent,
    DegreesComponent,
    StudyFieldsComponent,
    StudyFieldsFormComponent,
    TaxeContributionsFormComponent,
    TaxeContributionsComponent,
    LeaveTypesFormComponent,
    LeaveTypesComponent,
    CertificationTypeFormComponent,
    CertificationTypeListComponent,
    ContractTypeFormComponent,
    ContractTypeListComponent
  ],
  imports: [
    CommonModule,
    NgApexchartsModule,
    CarouselModule,
    SharedModule,
    FormsModule,
    NgxChartsModule,
    NgSelectModule,
    AgGridModule,
    ReactiveFormsModule,
    ParameterRoutingModule,
    TranslocoModule,
    NgxDropzoneModule,
    FormCompentModule,
  ],
})
export class ParameterModule { }

import { ContractRoutingModule } from './../../pages/contracts/contract-routing.module';
import { Routes } from '@angular/router';
import { PrivilegeGuard } from 'src/app/guard/privilege.guard';

export const content: Routes = [
  {
    path: '',
    loadChildren: () => import('../../pages/parameters/parameter.module').then(m => m.ParameterModule),
    canActivate: [PrivilegeGuard]
  },
  {
    path: '',
    loadChildren: () => import('../../pages/security/security.module').then(m => m.SecurityModule),
    canActivate: [PrivilegeGuard]

  },


  {
    path: '',
    loadChildren: () => import('../../pages/employees/employee.module').then(m => m.EmployeeModule),
    canActivate: [PrivilegeGuard]

  },

    {
    path: '',
    loadChildren: () => import('../../pages/compensations/compensations.module').then(m => m.CompasentionModule),
    canActivate: [PrivilegeGuard]

  },



  {
    path: '',
    loadChildren: () => import('../../pages/contracts/contract.module').then(m => m.ContractModule),
    canActivate: [PrivilegeGuard]

  },

  
  {
    path: '',
    loadChildren: () => import('../../pages/time-activities/time-activity.module').then(m => m.TimeActivityModule),
    canActivate: [PrivilegeGuard]

  },



  {
    path: '',
    loadChildren: () => import('../../pages/reciepts/reciept.module').then(m => m.RecieptModule),

  },


  {
    path: '',
    loadChildren: () => import('../../pages/dashboard/dashboard.module').then(m => m.DashboardModule),
  },

  {
    path: '',
    loadChildren: () => import('../../pages/user-settings/profile.module').then(m => m.ProfileModule),
  },


  {
    path: '',
    loadChildren: () => import('../../components/authentication/errorpages/errorpages.module').then(m => m.ErrorpagesModule),
  },
];

import { Routes } from "@angular/router";

export const COUNTENT_ROUTES:Routes =
[
  {
    path: '',
    loadChildren: () => import('../../components/authentication/signin/signin.module').then(m => m.SigninModule)
  }
];

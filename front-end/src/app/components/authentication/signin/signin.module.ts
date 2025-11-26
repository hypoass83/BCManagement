import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SigninRoutingModule } from './signin-routing.module';

import { CoverComponent } from './cover/cover.component';

@NgModule({
  declarations: [
    CoverComponent
  ],

  imports: [
    CommonModule,
    SigninRoutingModule
  ]
})
export class SigninModule { }

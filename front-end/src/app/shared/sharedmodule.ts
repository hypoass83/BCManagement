import { RouterModule } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import {  NgModule } from '@angular/core';
import { FullLayoutComponent } from './layout-components/full-layout/full-layout.component';
import { HeaderComponent } from './components/header/header.component';
import { SimplebarAngularModule } from 'simplebar-angular';
import { SwitcherComponent } from './components/switcher/switcher.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { FullscreenDirective } from './directives/fullscreen.directive';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { BacktotopComponent } from './components/backtotop/backtotop.component';
import { HoverEffectSidebarDirective } from './directives/hover-effect-sidebar.directive';
import { SidemenuToggleDirective } from './directives/sidemenuToggle';
import { ToggleThemeDirective } from './directives/toggle-theme.directive';
import { ActionCellRendererComponent } from '../pages/component/action-cell-renderer/action-cell-renderer.component';
import { ActionCellRendererAddComponent } from '../pages/component/action-cell-renderer-add/action-cell-renderer-add.component';
import { DetailCellRendererJourney } from '../pages/component/detail-cell-renderer-journey/detail-cell-renderer-journey';

@NgModule({
  declarations: [
    SidebarComponent,
    HeaderComponent,
    FullLayoutComponent,
    SwitcherComponent,
    PageHeaderComponent,
    FullscreenDirective,
    FooterComponent,
    BacktotopComponent,
    ToggleThemeDirective,
    HoverEffectSidebarDirective,
    SidemenuToggleDirective,
    ActionCellRendererComponent,
    ActionCellRendererAddComponent,
    DetailCellRendererJourney
  ],
  imports: [
    CommonModule,
    RouterModule,
    SimplebarAngularModule,
    ColorPickerModule,
    FormsModule
  ],

  exports: [
    FullLayoutComponent,
    SidebarComponent,
    HeaderComponent,
    PageHeaderComponent,
    FullscreenDirective,
    FooterComponent,
    SidemenuToggleDirective,
  ]
})
export class SharedModule {}

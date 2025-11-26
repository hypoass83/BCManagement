import { CUSTOM_ELEMENTS_SCHEMA, NgModule, provideExperimentalZonelessChangeDetection, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/sharedmodule';
import { CustomLayoutComponent } from './shared/layout-components/custom-layout/custom-layout.component';
import { ContentLayoutComponent } from './shared/layout-components/content-layout/content-layout.component';
import { ToastrModule } from 'ngx-toastr';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ColorPickerModule } from 'ngx-color-picker';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApiModule, AuthentificationService, Configuration, UserService } from './generated';
import { ConfirmationInterceptor } from './helper/interceptors/add-delete-confirmation-interceptor.helper';
import { ServiceModule } from './services/Service.modules';
import { TranslocoRootModule } from './transloco-root.module';
import { DeleteConfirmationDialog } from './helper-components/delete-confirmation-dialog';
import { GlobalErrorToast } from './helper-components/global-error-toast';
import { GlobalSuccessToast } from './helper-components/global-success-toast';
import { ToastInterceptor } from './helper/interceptors/add-toast-interceptor.helper';
import { AddConfirmationDialog } from './helper-components/add-confirmation-dialog';
import { AddTokenInterceptor } from './helper/interceptors/add-token-interceptor.helper';
import { AppRoutingModule } from './app-routing.module';
import { ConfigError } from './config.error';
import { environment } from 'src/environments/environment';
import { RefraicheComponent } from './pages/component/refraiche-page/refraiche.component';



@NgModule({
  declarations: [
    AppComponent,
    CustomLayoutComponent,
    ContentLayoutComponent,
    DeleteConfirmationDialog,
    GlobalErrorToast,
    GlobalSuccessToast,
    AddConfirmationDialog,
    RefraicheComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    ServiceModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    LeafletModule,
    ColorPickerModule,
    TranslocoRootModule,
    ApiModule.forRoot(() => new Configuration({ basePath: environment.apiUrl })),
  ],

  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    AuthentificationService,
    UserService,
    ConfigError,
    { provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ConfirmationInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ToastInterceptor,
      multi: true,
    },

    provideZoneChangeDetection({ eventCoalescing: true })
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],

})
export class AppModule { }

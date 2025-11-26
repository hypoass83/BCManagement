import { NgModule } from "@angular/core";
import { AuthService } from "./auth.service";
import SecurityModuleService from "./security/module.service";
import SecurityProfileService from "./security/profile.service";

import { AgGridThemeService } from "./theme/theme.service";

@NgModule({

  providers: [
    AuthService,SecurityModuleService,
    SecurityProfileService,AgGridThemeService
  ],
})
export class ServiceModule {}

import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { firstValueFrom, Observable } from "rxjs";
import * as CONST from "../app-const";
import { ProfileService } from "../generated";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root"
})
export class PrivilegeGuard implements CanActivate {

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private authService: AuthService,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    return firstValueFrom(this.profileService.profileControllerGetActionByPath(state.url)).then(res => {
      if (res) {
        return true;
      }

      if (state.url.includes('/settings/businessday/open')) {
        return true;
      }

      if (state.url.includes("receipt")) {
        return true;
      }

      else {
        this.router.navigate(['/authentication/403error']);
        return false;
      }
    })

  }
}

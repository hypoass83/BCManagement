import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(
    private router: Router,
    private authService: AuthService,
  ) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLogged()) {
      return true;
    }

    this.authService.logout();

    // this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url, action: true } });

    return false;
  }
}

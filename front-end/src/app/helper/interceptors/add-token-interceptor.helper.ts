import { AuthService } from '../../services/auth.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { addLoadingClass } from '../error-succes-tost';

@Injectable()
export class AddTokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with token if available
    if (!request.url.includes('filter'))
      addLoadingClass()
    if (!request.headers.get('Authorization')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.getAccessToken()}`
        },
        withCredentials: false
      });
    }
    return next.handle(request);
  }
}

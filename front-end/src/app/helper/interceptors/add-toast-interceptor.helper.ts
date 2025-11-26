import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { removeLoadingClass, setGlobalErrorMessage, setGlobalSuccesMessage } from '../error-succes-tost';

@Injectable({
  providedIn: 'root'
})
export class ToastInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          removeLoadingClass(); // Function to remove loading indicator
          if (request.method !== 'GET') {
            setGlobalSuccesMessage(); // Function to set global success message
          }

          setTimeout(() => {
            const a = window as any;
            a.HSStaticMethods.autoInit()
          }, 10)

        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        removeLoadingClass(); // Ensure loading class is removed on error
        if (!(error.error instanceof ErrorEvent)) {
          console.error('HTTP Error:', error);
          if (error.error?.error) {
            setGlobalErrorMessage(error.error?.error);
          }
          else if (error.error?.title) {
            setGlobalErrorMessage(error.error?.title);
          } else {
            setGlobalErrorMessage(error.error?.error);
          }
          // Function to set global error message
        }

        if (error.status === 401) {
          // Handle 401 errors
          // Redirect to login or refresh token

        //  this.auth.logout();
        }

        return throwError(() => new Error(error.error.message || 'Server error'));
      })
    );
  }

}



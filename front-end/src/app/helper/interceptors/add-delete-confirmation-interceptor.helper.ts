import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { showConfirmationDialog } from '../delete-confirmation';
import { addLoadingClass, removeLoadingClass } from '../error-succes-tost';
import { showAddConfirmationDialog } from '../add-confirmation';

@Injectable()
export class ConfirmationInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method === 'DELETE') {
      removeLoadingClass()
      // Convert Promise to Observable using `from`
      return from(showConfirmationDialog()).pipe(
        mergeMap((confirmed: boolean) => {
          if (!confirmed) {
            // Throw error to cancel the request
            return throwError(() => new Error('Delete canceled by user'));
          }
          addLoadingClass();
          return next.handle(req);  // Proceed with the request if confirmed
        }),
        catchError((error) => {
          // Handle potential errors in the confirmation dialog or request flow
          return throwError(() => error);
        })
      );
    } else

      if (req.method === 'PUT' || req.method === 'POST') {

        if (!req.url.includes('login')) {
          removeLoadingClass()
          // Convert Promise to Observable using `from`
          return from(showAddConfirmationDialog()).pipe(
            mergeMap((confirmed: boolean) => {
              if (!confirmed) {
                // Throw error to cancel the request
                return throwError(() => new Error('ADD canceled by user'));
              }
              addLoadingClass();
              return next.handle(req);  // Proceed with the request if confirmed
            }),
            catchError((error) => {
              // Handle potential errors in the confirmation dialog or request flow
              return throwError(() => error);
            })
          );
        }
      }


    // Pass through for other requests
    return next.handle(req);
  }
}

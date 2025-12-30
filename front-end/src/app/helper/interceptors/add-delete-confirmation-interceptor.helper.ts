import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
//import { showAddConfirmationDialog, showDeleteConfirmationDialog } from '../confirmation-dialogs';
// ✔ Correction ici 🔥
import { showConfirmationDialog as showDeleteConfirmationDialog } from '../delete-confirmation';
import { showAddConfirmationDialog } from '../add-confirmation';
import { SKIP_CONFIRM } from './skip-confirm.token';

@Injectable()
export class ConfirmationInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // 🚫 Skip login + auth check
    if (req.url.includes('/login') || req.url.includes('/auth')) {
      return next.handle(req);
    }

    // 🚫 Skip upload/import → no popup ever
    if (req.url.includes('/upload') || req.url.includes('/import')) {
      return next.handle(req);
    }

    // ✅ CHECK FIRST
    if (req.context.get(SKIP_CONFIRM)) {
      return next.handle(req);
    }

    // 🗑 DELETE confirmation
    if (req.method === 'DELETE') {
      return from(showDeleteConfirmationDialog()).pipe(
        mergeMap(confirm => confirm ? next.handle(req) : throwError(() => new Error('Delete canceled')))
      );
    }

    // ✍️ POST/PUT confirmation
    if (req.method === 'POST' || req.method === 'PUT') {
      return from(showAddConfirmationDialog()).pipe(
        mergeMap(confirm => confirm ? next.handle(req) : throwError(() => new Error('Action canceled')))
      );
    }

    return next.handle(req);
  }
}

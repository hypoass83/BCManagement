import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private removeClassSubject = new BehaviorSubject<boolean>(false);
  removeClass$ = this.removeClassSubject.asObservable();

  setRemoveClass() {
    this.removeClassSubject.next(true);
  }
}

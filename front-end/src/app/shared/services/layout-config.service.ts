import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutConfigService {
  private config = {
    DirectionsChangeltr: 'ltr',
    theme: 'light',
    NavigationChange: 'vertical',
  };

  getConfig() {
    return this.config;
  }

  updateLayout(newLayout: any) {
    this.config = newLayout;
  }

  // private mainContentState = new BehaviorSubject<boolean>(true);
  // mainContentState$ = this.mainContentState.asObservable();

  // setMainContentState(state: boolean) {
  //   this.mainContentState.next(state);
  // }
}

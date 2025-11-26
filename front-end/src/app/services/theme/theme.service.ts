import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})


export class AgGridThemeService {

  theme = signal<string>("ag-theme-alpine")
}

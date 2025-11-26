import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  printComponent(componentId: string): void {
    const printContents = document.getElementById(componentId)?.innerHTML;
    if (printContents) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;

      document.body.innerHTML = originalContents;
      window.location.reload(); // Reload to restore the original state
    }
  }
}

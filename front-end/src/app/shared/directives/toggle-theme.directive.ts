import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appToggleTheme]'
})
export class ToggleThemeDirective {
  private body:HTMLBodyElement | any = document.querySelector('body');
  constructor() { }

  @HostListener('click') toggleTheme(){

    if (this.body != !this.body) {
      this.body.classList.toggle('dark');
      this.body.classList.remove('bg-img1');
      this.body.classList.remove('bg-img2');
      this.body.classList.remove('bg-img3');
      this.body.classList.remove('bg-img4');
       if (localStorage.getItem('synto-header-mode') == 'light') {
         const body: any = document.querySelector('body');
         body.removeAttribute('class');
       }
    }
  }
}

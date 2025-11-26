import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.scss']
})
export class CoverComponent {
  constructor(@Inject(DOCUMENT) private document: Document,private elementRef: ElementRef,
  private renderer: Renderer2) {}
  ngOnInit(): void {
    const authe: any = document.querySelector('.auth');
    authe.setAttribute('class', 'h-full');

    this.renderer.addClass(this.document.body, 'h-full');
    this.renderer.addClass(this.document.body, '!py-0');
    this.renderer.addClass(this.document.body, 'bg-white');
    this.renderer.addClass(this.document.body, 'dark:bg-bgdark');

    const html : any = this.elementRef.nativeElement.ownerDocument.documentElement;
    html.removeAttribute('data-header-styles', 'light');

    html.removeAttribute('data-nav-layout','vertical');
    html.classList.add('h-full', 'light');
     if (localStorage.getItem('synto-header-mode') == 'dark') {
       const html: any = this.elementRef.nativeElement.ownerDocument.documentElement;
       html.classList.add('h-full', 'dark');
     }
 }

  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'h-full');
    this.renderer.removeClass(this.document.body, '!py-0');
    this.renderer.removeClass(this.document.body, 'bg-white');
    this.renderer.removeClass(this.document.body, 'dark:bg-bgdark');
      if (localStorage.getItem('synto-header-mode') == 'dark') {
        const html: any = this.elementRef.nativeElement.ownerDocument.documentElement;
        html.classList.remove('h-full', 'dark');
      }

   const authe: any = document.querySelector('.h-full');
   authe.removeAttribute('class', 'h-full');

  }
}

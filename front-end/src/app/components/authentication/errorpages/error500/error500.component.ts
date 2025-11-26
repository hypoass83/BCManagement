import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-error500',
  templateUrl: './error500.component.html',
  styleUrls: ['./error500.component.scss'],
})
export class Error500Component {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2, private elementRef: ElementRef
  ) {}
  ngOnInit(): void {
    this.renderer.addClass(this.document.body, 'h-full');
    this.renderer.addClass(this.document.body, '!py-0');
    this.renderer.addClass(this.document.body, 'bg-white');
    this.renderer.addClass(this.document.body, 'dark:bg-bgdark');

    const authe: any = document.querySelector('.auth');
    authe.setAttribute('class', 'h-full');

    const html: any = this.elementRef.nativeElement.ownerDocument.documentElement;
    html.setAttribute('class', 'h-full');
    html.removeAttribute('data-header-styles', 'light');
    // html.removeAttribute('data-nav-layout', 'vertical');
    if (localStorage.getItem('synto-header-mode') == 'dark') {
      const html: any = this.elementRef.nativeElement.ownerDocument.documentElement;
      html.classList.add('h-full', 'dark');
    }
  }

  ngOnDestroy(): void {
    const authe: any = document.querySelector('.h-full');
    authe.removeAttribute('class', 'h-full');
    if (localStorage.getItem('synto-header-mode') == 'dark') {
      const html: any = this.elementRef.nativeElement.ownerDocument.documentElement;
      html.classList.remove('h-full', 'dark');
    }
  }
}

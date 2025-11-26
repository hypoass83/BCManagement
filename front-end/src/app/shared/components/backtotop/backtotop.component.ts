import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-backtotop',
  templateUrl: './backtotop.component.html',
  styleUrls: ['./backtotop.component.scss'],
})
export class BacktotopComponent {
  public show = false;

  constructor(private viewScroller: ViewportScroller,private elementRef: ElementRef) { }
  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const number =
      window.scrollY ||
      this.elementRef.nativeElement.ownerDocument.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (number > 400) {
      this.show = true;
    } else {
      this.show = false;
    }
  }

  taptotop() {
    this.viewScroller.scrollToPosition([0, 0]);
  }
}

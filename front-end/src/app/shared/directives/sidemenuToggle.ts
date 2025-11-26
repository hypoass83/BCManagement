import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
@Directive({
  selector: '[appSidemenuToggle]',
})
export class SidemenuToggleDirective {
  
  @Output() clickOutside = new EventEmitter();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  onClick(target: any) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
}

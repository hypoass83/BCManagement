import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { Menu, NavService } from '../../services/navservice';
import { SwitcherService } from 'src/app/shared/services/switcher.service';
import * as switcher from '../../../shared/components/switcher/switcher';

@Component({
  selector: 'app-full-layout',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.scss'],
})
export class FullLayoutComponent {
  public menuItems!: Menu[];

  constructor(
    public navServices: NavService,
    public SwitcherService: SwitcherService,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.navServices.items.subscribe((menuItems: any) => {
      this.menuItems = menuItems;
    });

    // this.menuItems = this.navServices.items()
  }
  togglesidemenuBody() {
    if (document.documentElement.getAttribute('data-nav-layout') == 'horizontal' && window.innerWidth > 992) {
      this.closeMenu();
    }
  }
  closeMenu() {
    this.menuItems?.forEach((a: any) => {
      if (this.menuItems) {
        a.active = false;
      }
      a?.children?.forEach((b: any) => {
        if (a.children) {
          b.active = false;
        }
      });
    });
  }
  clearToggle() {
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
    html?.setAttribute('toggled', 'close');
    document.querySelector('#responsive-overlay')?.classList.remove('active');
  }
  ngOnInit(): void {
    this.navServices.items.subscribe((items) => {
      this.menuItems = items;
    });
    // this.menuItems = this.navServices.items()
  }
}

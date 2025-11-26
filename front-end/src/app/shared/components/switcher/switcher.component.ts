import { Component, ElementRef, Renderer2 } from '@angular/core';
import * as switcher from './switcher';
import { Menu, NavService } from '../../services/navservice';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-switcher',
  templateUrl: './switcher.component.html',
  styleUrls: ['./switcher.component.scss'],
})
export class SwitcherComponent {
  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private navServices: NavService
  ) {

  }

  themeChange(type: string, type1: string) {
    const htmlElement = this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.setAttribute(htmlElement, 'class', type);
    localStorage.setItem('synto-theme-mode', type);

    this.renderer.setAttribute(htmlElement, 'data-header-styles', type1);
    localStorage.setItem('synto-header-mode', type1);

    if (localStorage.getItem('synto-header-mode') == 'light') {
      this.elementRef.nativeElement.ownerDocument.documentElement?.removeAttribute('style');
      this.body = document.querySelector('body');
      this.body?.classList.remove('dark');
    }
  }

  DirectionsChange(type: string) {
    // this.elementRef.nativeElement.ownerDocument.documentElement?.setAttribute('dir', type);
    // localStorage.setItem('synto-dir', type);
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.setAttribute(htmlElement, 'dir', type);
    localStorage.setItem('synto-dir', type);
  }

  NavigationChange(type: string) {
    const htmlElement = this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.setAttribute(htmlElement, 'data-nav-layout', type);
    if(type == 'horizontal'){
      this.renderer.setAttribute(htmlElement, 'data-menu-styles', 'light');
    }else{
      this.renderer.setAttribute(htmlElement, 'data-menu-styles', 'dark');
    }
    localStorage.setItem('synto-nav-mode', type);
  }

  PageChange(type: string) {
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.setAttribute(htmlElement, 'data-page-style', type);
    localStorage.setItem('synto-page-mode', type);
  }

  WidthChange(type: string) {
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.setAttribute(htmlElement, 'data-width', type);
    localStorage.setItem('synto-width-mode', type);
  }

  MenuChange(type: string) {
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.setAttribute(htmlElement, 'data-menu-position', type);
    localStorage.setItem('synto-menu-position', type);
  }

  HeaderChange(type: string) {
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.setAttribute(htmlElement, 'data-header-position', type);
    localStorage.setItem('synto-header-position', type);
  }

  Menustyles(type: string, type1: string) {
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    localStorage.setItem('synto-menu-style', type);
    this.renderer.setAttribute(htmlElement, 'toggled', type1);
    localStorage.setItem('synto-menu-style', type1);
    this.renderer.setAttribute(htmlElement, 'toggled', type1);
    localStorage.setItem('synto-menu-style', type1);
  }
  menuItems!: any;
  Menus(type: string, type1: string) {
    this.navServices.items.subscribe((items) => {
      this.menuItems = items;
    });
    // this.menuItems = this.navServices.items()
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.setAttribute(htmlElement, 'data-nav-style', type1);
    localStorage.setItem('synto-menu-styles', type1);
    localStorage.setItem('synto-menu-styles-toggled', type);
    this.renderer.setAttribute(htmlElement, 'toggled', type);
    this.renderer.removeAttribute(htmlElement, 'data-vertical-style');

  }
  menuTheme(type: string) {
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.setAttribute(htmlElement, 'data-menu-styles', type);
    localStorage.setItem('synto-menu-mode', type);
  }
  closeMenu(type1: any) {
    if (type1 == 'icon-hover' || type1 == 'menu-hover') {
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
  }

  headerTheme(type: string) {
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    this.renderer.setAttribute(htmlElement, 'data-header-styles', type);
    localStorage.setItem('synto-header-mode', type);
  }
  primary(type: string) {
    this.elementRef.nativeElement.ownerDocument.documentElement?.style.setProperty('--color-primary', type);
    this.elementRef.nativeElement.ownerDocument.documentElement?.style.setProperty('--color-primary-rgb', type);
    localStorage.setItem('synto-primary-mode', type);
    localStorage.removeItem('Syntolight-primary-color');
  }
  background(bodyBg: string, darkBg: string, event: string, type1: string) {

    this.elementRef.nativeElement.ownerDocument.documentElement?.style.setProperty('--body-bg', bodyBg);
    this.elementRef.nativeElement.ownerDocument.documentElement?.style.setProperty('--dark-bg', darkBg);
    localStorage.setItem('synto-background-mode-body', bodyBg);
    localStorage.setItem('synto-background-mode-dark', darkBg);

    this.elementRef.nativeElement.ownerDocument.documentElement?.setAttribute('class', event);
    localStorage.setItem('synto-theme-mode', event);

    this.elementRef.nativeElement.ownerDocument.documentElement?.setAttribute('data-header-styles', type1);
    localStorage.setItem('synto-header-mode', type1);

    localStorage.removeItem("Syntolight-background-dark");
    localStorage.removeItem("Syntolight-background-body")
  }

  //primary theme change
  public dynamicLightPrimary(data: any): void {
    this.color1 = data.color;

    const dynamicPrimaryLight = document.querySelectorAll(
      'input.color-primary-light'
    );

    switcher.dynamicLightPrimaryColor(dynamicPrimaryLight, this.color1);

    localStorage.setItem('Syntolight-primary-color', switcher.hexToRgba(this.color1) || '');
    localStorage.setItem('Syntolight-primary-hover', switcher.hexToRgba(this.color1) || '');
    localStorage.setItem('Syntolight-primary-border', switcher.hexToRgba(this.color1) || '');
    localStorage.setItem('Syntolight-mode', 'true');
    this.body?.classList.remove('transparent-mode');

    // Adding
    this.body?.classList.add('light-mode');

    // Removing
    this.body?.classList.remove('dark');
    this.body?.classList.remove('bg-img1');

    // removing data from session storage

    // switcher.checkOptions();
    localStorage.removeItem('synto-primary-mode');
  }

  //background theme change
  public color4 = '#6c5ffc';
  body = document.querySelector('body');
  public dynamicTranparentBgPrimary(data: any): void {
    this.color4 = data.color;
    const dynamicPrimaryBgTrasnsparent = document.querySelectorAll(
      'input.color-bg-transparent'
    );

    switcher.dynamicBgTrasnsparentPrimaryColor(
      dynamicPrimaryBgTrasnsparent,
      this.color4
    );

    // Adding
    localStorage.setItem('Syntolight-background-body', switcher.hexToRgba(this.color4) || '');
    localStorage.setItem('Syntolight-background-dark', switcher.hexToRgba2(this.color4) || '');
    // Removing
    const html: any = this.elementRef.nativeElement.ownerDocument.documentElement;
    html.setAttribute('data-header-styles', 'dark');
    localStorage.removeItem('SyntoDark');
    localStorage.removeItem('SyntoLight');

    this.elementRef.nativeElement.ownerDocument.documentElement?.classList.add('dark');
    document
      .querySelector('.app-header')
      ?.classList.add(
        'hor-header',
        'fixed-header',
        'visible-title',
        'stickyClass'
      );

    localStorage.removeItem('synto-header-styles');
    localStorage.removeItem('Syntolight-primary-hover');
    localStorage.removeItem('Syntolight-primary-border');
    localStorage.removeItem('Syntodark-primary-color');
    localStorage.removeItem('Syntotransparent-bgImg-primary-color');
    localStorage.removeItem('SyntoBgImage');
    localStorage.removeItem("synto-background-mode-body")
    localStorage.removeItem("synto-background-mode-dark")
  }

  color1 = '#1457e6';
  color = '#1ae715';

  ImageTheme(type: string) {
    this.elementRef.nativeElement.ownerDocument.documentElement?.setAttribute('bg-img', type);
    localStorage.setItem('synto-image', type);
  }

  reset() {
    localStorage.clear();
    const html: any = this.elementRef.nativeElement.ownerDocument.documentElement;
    const body: any = document.querySelector('body');
    html.style = '';
    html.setAttribute('class', 'light');
    html.setAttribute('data-vertical-style', 'overlay');
    html.setAttribute('dir', 'ltr');
    html.setAttribute('data-nav-layout', 'vertical');
    html.removeAttribute('data-page-style', 'regular');
    html.removeAttribute('data-width', 'full-width');
    html.removeAttribute('data-menu-position', 'fixed');
    html.removeAttribute('data-header-position', 'fixed');
    html.setAttribute('data-header-styles', 'light');
    html.setAttribute('data-menu-styles', 'dark');
    html.removeAttribute('bg-img', 'dark');
    html.removeAttribute('toggled', 'overlay');
    body.removeAttribute('class');
    html.removeAttribute("data-nav-style")

    const menuclickclosed = document.getElementById(
      'switcher-menu-click'
    ) as HTMLInputElement;
    menuclickclosed.checked = false;
    const menuhoverclosed = document.getElementById(
      'switcher-menu-hover'
    ) as HTMLInputElement;
    menuhoverclosed.checked = false;
    const iconclickclosed = document.getElementById(
      'switcher-icon-click'
    ) as HTMLInputElement;
    iconclickclosed.checked = false;
    const iconhoverclosed = document.getElementById(
      'switcher-icon-hover'
    ) as HTMLInputElement;
    iconhoverclosed.checked = false;

    // switcher.checkOptions();
  }

  public localdata = localStorage;

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (localStorage.getItem('synto-header-mode') == 'light') {
      this.elementRef.nativeElement.ownerDocument.documentElement?.removeAttribute('style');
    }
  }
  ngOnInit(): void {
    switcher.localStorageBackUp();
    this.closeMenu(localStorage.getItem('synto-menu-styles'));
  }
}

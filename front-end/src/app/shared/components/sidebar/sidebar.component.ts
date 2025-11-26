import { Component, ViewChild, ElementRef, Renderer2, HostListener, effect } from '@angular/core';
import { Menu, NavService } from '../../services/navservice';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { checkHoriMenu, switcherArrowFn } from './sidebar';
import { TranslocoService } from '@ngneat/transloco';
import SecurityModuleService from 'src/app/services/security/module.service';
import { COMPANY } from 'src/app/app-const';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  // Addding sticky-pin
  scrolled = false;
  screenWidth: number;
  eventTriggered = false;
  public localdata = localStorage;

  @HostListener('window:scroll', [])
  onWindowScroll() {

    const navScrollElement =
      this.elementRef.nativeElement.querySelector('.nav-scroll');
    this.scrolled = window.scrollY > 10;

    const sections = document.querySelectorAll('.side-menu__item');
    const scrollPos =
      window.scrollY ||
      this.elementRef.nativeElement.ownerDocument.documentElement.scrollTop ||
      document.body.scrollTop;



    sections.forEach((ele, i) => {
      const currLink = sections[i];
      const val: any = currLink.getAttribute('value');
      const refElement: any = document.querySelector('#' + val);

      // Add a null check here before accessing properties of refElement
      if (refElement !== null) {
        const scrollTopMinus = scrollPos + 73;
        if (
          refElement.offsetTop <= scrollTopMinus &&
          refElement.offsetTop + refElement.offsetHeight > scrollTopMinus
        ) {
          if (navScrollElement) {
            this.renderer.removeClass(navScrollElement, 'active');
          }
          currLink.classList.add('active');
        } else {
          currLink.classList.remove('active');
        }
      }
    });
  }
  //////

  public windowSubscribe$!: Subscription;
  options = { autoHide: false, scrollbarMinSize: 100 };
  icon!: SafeHtml;

  public menuItems = this.moduleService.UserModuleList

  constructor(
    private navServices: NavService,
    private sanitizer: DomSanitizer,
    public router: Router,
    private moduleService: SecurityModuleService,
    public renderer: Renderer2,
    private translocoService: TranslocoService,
    private elementRef: ElementRef,
  ) {
    this.screenWidth = window.innerWidth;
  }

  companyName = "";
  ngOnInit() {

    this.ParentActive();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.ParentActive();
      }
    });
    if (window.innerWidth <= 992) {
      document.documentElement?.setAttribute('toggled', 'close');
    }
    const WindowResize = fromEvent(window, 'resize');
    // subscribing the Observable
    if (WindowResize) {
      this.windowSubscribe$ = WindowResize.subscribe(() => {
        // to check and adjst the menu on screen size change
        checkHoriMenu();
      });
    }
    switcherArrowFn();
    checkHoriMenu();
    if (document.documentElement.getAttribute('data-nav-layout') == 'horizontal' && window.innerWidth > 992) {
      this.closeNavActive();
    }
  }

  //Active Nav State
  setNavActive(item: any) {
    this.menuItems().filter((menuItem) => {
      if (menuItem !== item) {
        menuItem.active = false;
        //   this.navServices.collapseSidebar = false;
      }
      if (menuItem.children && menuItem.children.includes(item)) {
        menuItem.active = true;
        menuItem.selected = true;
      }
      if (menuItem.children) {
        menuItem.children?.filter((submenuItems) => {
          if (submenuItems.children && submenuItems.children.includes(item)) {
            menuItem.active = true;
            submenuItems.active = true;
            menuItem.selected = true;
            submenuItems.selected = true;
          }
          if (submenuItems.children) {
            submenuItems.children?.forEach((subsubmenuItems) => {
              if (
                subsubmenuItems.children &&
                subsubmenuItems.children.includes(item)
              ) {
                menuItem.active = true;
                submenuItems.active = true;
                subsubmenuItems.active = true;
                menuItem.selected = true;
                submenuItems.selected = true;
                subsubmenuItems.selected = true;
              }
            });
          }
        });
      }
    });
  }

  // Toggle menu
  toggleNavActive(item: any) {
    if (!item.active) {
      this.menuItems().forEach((a: any) => {
        if (this.menuItems().includes(item)) {
          a.active = false;
        }
        a?.children?.forEach((b: any) => {
          if (a.children.includes(item)) {
            b.active = false;
          } else {
            b.active = false;
          }
          b?.children?.forEach((c: any) => {
            if (b.children.includes(item)) {
              c.active = false;
            }
          });
        });
      });
    }
    item.active = !item.active;
  }
  // Close Nav menu
  closeNavActive() {
    this.menuItems().forEach((a: any) => {
      if (this.menuItems()) {
        a.active = false;
      }
      a?.children?.forEach((b: any) => {
        if (a.children) {
          b.active = false;
        }
      });
    });
  }



  ParentActive() {
    this.menuItems().map((element: any) => {
      if (element.children) {
        element.children.map((ele: any) => {
          if (ele.path == this.router.url) {
            element.active = true;
            element.selected = true;
          }
          if (ele.children) {
            ele.children.map((child1: any) => {
              if (child1.path == this.router.url) {
                element.active = true;
                element.selected = true;
                ele.active = true;
                ele.selected = true;
              }
            });
          }
        });
      }
    });
  }


  @ViewChild('iconContainer', { static: true }) iconContainer!: ElementRef;
  getSanitizedSVG(svgContent: string, menu: any): SafeHtml {
    const svg = this.renderer.createElement(
      'svg',
      'http://www.w3.org/2000/svg'
    );
    svg.innerHTML = svgContent;
    svg.classList.add('side-menu__icon');
    this.renderer.listen(svg, 'click', () => {
      this.toggleNavActive(menu);
    });
    // return svg;
    return this.sanitizer.bypassSecurityTrustHtml(svgContent);
  }
  ngOnDestroy() {

    this.windowSubscribe$.unsubscribe();
    this.elementRef.nativeElement.ownerDocument.documentElement,
      'data-nav-layout',
      'vertical';
    const WindowResize = fromEvent(window, 'resize');
    // subscribing the Observable
    if (WindowResize) {
      this.windowSubscribe$ = WindowResize.subscribe(() => {
        // to check and adjst the menu on screen size change
        checkHoriMenu();
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.screenWidth = window.innerWidth;

    // Check if the event hasn't been triggered and the screen width is less than or equal to your breakpoint
    if (!this.eventTriggered && this.screenWidth <= 992) {
      document.documentElement?.setAttribute('toggled', 'close');

      // Trigger your event or perform any action here
      this.eventTriggered = true; // Set the flag to true to prevent further triggering
    } else if (this.screenWidth > 992) {
      // Reset the flag when the screen width goes beyond the breakpoint
      this.eventTriggered = false;
    }
  }
  t(key: string, params?: object): Observable<string> {
    //   return new Observable()
    return this.translocoService.selectTranslate(`side_bar.${key}`, params);
  }
}

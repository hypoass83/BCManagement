import { AuthService } from '../../../services/auth.service';
/* eslint-disable no-constant-condition */
import { Component, effect, ElementRef } from '@angular/core';
import { NavService } from '../../services/navservice';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { convertDateFormatedDate, convertStringToFormatedDate } from 'src/app/tools/tools';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent {

  selectedCountry = './assets/img/flags/en.png';
  constructor(public navServices: NavService, private router: Router, private authService: AuthService,private themeService:AgGridThemeService,
    private elementRef: ElementRef, private translocoService: TranslocoService) {
    this.onCountrySelect(localStorage.getItem("USER_LANGUAGE") ?? 'en')
    effect(() => {

        this.current_bd = convertStringToFormatedDate( (new Date()).toDateString())

      const theme = localStorage.getItem('synto-theme-mode');
      if(theme=="dark"){
        this.themeService.theme.update(()=>"ag-theme-alpine-dark")
      }else{
        this.themeService.theme.update(()=>"ag-theme-alpine")
      }
    }, { allowSignalWrites: true });
  }



  current_user = this.authService.getUser();
  current_bd = convertStringToFormatedDate((new Date()).toDateString())




  onCountrySelect(languageCode: string): void {
    if (languageCode === 'en') {
      this.selectedCountry = './assets/img/flags/en.png';
    } else {
      this.selectedCountry = './assets/img/flags/fr.png';
    }

    this.translocoService.setActiveLang(languageCode);

    localStorage.setItem("USER_LANGUAGE", languageCode);

  }

  // themeChange(type: string, type1: string) {
  //   this.elementRef.nativeElement.ownerDocument.documentElement?.setAttribute('class', type);
  //   this.elementRef.nativeElement.ownerDocument.documentElement?.setAttribute('style', "");
  //   localStorage.removeItem("synto-background-mode-body");
  //   localStorage.removeItem("synto-background-mode-dark");
  //   localStorage.setItem('synto-theme-mode', type);
  //   this.elementRef.nativeElement.ownerDocument.documentElement?.setAttribute('data-header-styles', type1);
  //   localStorage.setItem('synto-header-mode', type1);
  //   if (type == 'dark') {
  //     const darkbtn = document.querySelector(
  //       '#switcher-dark-theme'
  //     ) as HTMLInputElement;
  //     darkbtn.checked = true;
  //   } else {
  //     const lightbtn = document.querySelector(
  //       '#switcher-light-theme'
  //     ) as HTMLInputElement;
  //     lightbtn.checked = true;
  //   }
  // }


  themeChange(type: string, type1: string) {
    this.elementRef.nativeElement.ownerDocument.documentElement?.setAttribute('class', type);
    this.elementRef.nativeElement.ownerDocument.documentElement?.setAttribute('style', "");
    localStorage.removeItem("synto-background-mode-body");
    localStorage.removeItem("synto-background-mode-dark");
    localStorage.setItem('synto-theme-mode', type);
    this.elementRef.nativeElement.ownerDocument.documentElement?.setAttribute('data-header-styles', type1);
    localStorage.setItem('synto-header-mode', type1);

    // Set the theme for the entire document
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(type === 'dark' ? 'dark-mode' : 'light-mode');

    // Handle UI button state
    if (type === 'dark') {
      (document.querySelector('#switcher-dark-theme') as HTMLInputElement).checked = true;
      this.themeService.theme.update(()=>"ag-theme-alpine-dark")
    } else {
      (document.querySelector('#switcher-light-theme') as HTMLInputElement).checked = true;
      this.themeService.theme.update(()=>"ag-theme-alpine")
    }
  }


  toggleSidebar() {
    const html = this.elementRef.nativeElement.ownerDocument.documentElement;
    if (window.innerWidth <= 992) {
      html?.setAttribute('toggled', html?.getAttribute('toggled') == 'open' ? 'close' : 'open');
      if (html?.getAttribute('toggled') == 'open') {
        document.querySelector('#responsive-overlay')?.classList.add('active');
      } else {
        document.querySelector('#responsive-overlay')?.classList.remove('active');
      }
    }
    else if (!localStorage.getItem('synto-menu-styles')) {
      html?.setAttribute('toggled', html?.getAttribute('toggled') == 'icon-overlay-close' ? '' : 'icon-overlay-close');
    } else {
      if (localStorage.getItem('synto-menu-styles') == 'menu-click') {
        html?.setAttribute('toggled', html?.getAttribute('toggled') == 'menu-click-closed' ? '' : 'menu-click-closed');
      }
      if (localStorage.getItem('synto-menu-styles') == 'menu-hover') {
        html?.setAttribute('toggled', html?.getAttribute('toggled') == 'menu-hover-closed' ? '' : 'menu-hover-closed');
      }
      if (localStorage.getItem('synto-menu-styles') == 'icon-click') {
        html?.setAttribute('toggled', html?.getAttribute('toggled') == 'icon-click-closed' ? '' : 'icon-click-closed');
      }
      if (localStorage.getItem('synto-menu-styles') == 'icon-hover') {
        html?.setAttribute('toggled', html?.getAttribute('toggled') == 'icon-hover-closed' ? '' : 'icon-hover-closed');
      }

    }
  }

  isShowDiv = false;

  removeRow(rowId: string) {
    const rowElement = document.getElementById(rowId);
    if (rowElement) {
      rowElement.remove();
    }
  }

  logOut() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    const windowObject: any = window;
    const html = this.elementRef.nativeElement.ownerDocument.documentElement;
    if (windowObject.innerWidth <= '991') {
      html?.setAttribute('toggled', 'open');
    }
    window.addEventListener('resize', () => {
      if (localStorage.getItem('synto-menu-style') != 'icon-text-close') {
        if (windowObject.innerWidth <= '991') {
          html?.setAttribute('toggled', 'open');
        } else {
          if (
            !(localStorage.getItem('synto-menu-style') == 'double-menu-open')
          ) {
            html?.removeAttribute('toggled');
          }
        }
      } else {
        document
          .querySelector('html')
          ?.setAttribute('toggled', 'icon-text-close');
      }
    });
  }

  handleCardClick(event: MouseEvent) {
    // Prevent the click event from propagating to the container
    event.stopPropagation();
  }
  removetheModal() {
    const element: any = document.querySelector('.serachmodal');
    element.click();
  }
}

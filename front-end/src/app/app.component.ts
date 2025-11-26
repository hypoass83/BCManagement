import { UserService } from './generated';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { AuthService } from './services/auth.service';
import { firstValueFrom } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { COMPANY } from './app-const';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { openModal } from './helper/helper-function';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private renderer: Renderer2,
    private authService: AuthService,
    private authentificationService: UserService,


    private http:HttpClient
  ) {}

  title = 'valdoz-front-end';
  async ngOnInit() {
    const newElement = this.renderer.createElement('html');
    this.renderer.appendChild(document.body, newElement);

    if(this.authService.isLogged()){
      try{
        const user = await this.authService.getCurrentUser();
        if (!user) {
          this.authService.logout();
        }
      }catch (e) {
        this.authService.logout();
      }


    }



    // Listen for route changes and reapply the theme
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('receipt')) {
          document.documentElement.setAttribute('class', 'light');
        } else {
          const currentTheme =
            localStorage.getItem('synto-theme-mode') || 'light';

          setTimeout(() => {
            const savedTheme =
              localStorage.getItem('synto-theme-mode') || 'light';
            this.themeChange(savedTheme, savedTheme);
          }, 1000);
        }
      }
    });

    window.onload = () => {
      const currentTheme = localStorage.getItem('synto-theme-mode') || 'light';
      this.themeChange(currentTheme, currentTheme);
      setTimeout(() => {
        const savedTheme = localStorage.getItem('synto-theme-mode') || 'light';
        this.themeChange(savedTheme, savedTheme);
      }, 1000);
    };

    setInterval(() => {
      if (environment.production){
        this.http
        .get('/valdoz/assets/version.json', {
          headers: { 'Cache-Control': 'no-cache' },
        })
        .subscribe((data: any) => {
          if (data.version !== environment.appVersion) {
            openModal("refraiche-page")
          }
        });
      }
    }, 60000);
  }

  ngAfterViewInit() {
    // Ensure theme is applied only after the window has loaded
    setTimeout(() => {
      const savedTheme = localStorage.getItem('synto-theme-mode') || 'light';
      this.themeChange(savedTheme, savedTheme);
    }, 1000);
  }

  themeChange(type: string, type1: string) {
    document.documentElement.setAttribute('class', type);
    document.documentElement.setAttribute('data-header-styles', type1);

    localStorage.setItem('synto-theme-mode', type);
    localStorage.setItem('synto-header-mode', type1);

    // Update AG Grid theme dynamically
    const gridContainers = document.querySelectorAll(
      '.ag-grid-container ag-grid-angular'
    );

    gridContainers.forEach((grid) => {
      grid.classList.remove('ag-theme-alpine', 'ag-theme-alpine-dark');
      grid.classList.add(
        type === 'dark' ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'
      );
    });

    // Set body class for global styles
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(type === 'dark' ? 'dark-mode' : 'light-mode');
  }
}

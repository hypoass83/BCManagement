import { Component, Renderer2 } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import SecurityModuleService from 'src/app/services/security/module.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { COMPANY } from 'src/app/app-const';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {

  public loginForm!: FormGroup;
  public error = '';

  isSubmitted = false;


  imagePath: SafeResourceUrl | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private _sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private moduleService: SecurityModuleService,

  ) {
    const bodyElement = this.renderer.selectRootElement('body', true);
    this.renderer.setAttribute(bodyElement, 'class', 'cover1 justify-center');
  }


//   <img
//   *ngIf="imagePath"
//   [src]="imagePath"
//   alt="Company Logo"
//   class="h-28 mb-2"
// />
  ngOnInit(): void {

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });

    // const comp: CompanyModel = JSON.parse(localStorage.getItem(COMPANY) ?? "")

    // this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
    //   + comp.archive?.fileBase64);
  }



  get form() {
    return this.loginForm.controls;
  }

  async Submit() {
    this.isSubmitted = true;

    if (this.loginForm.valid) {
      try {
        const res = await this.authService.login(this.form['username'].value, this.form['password'].value);
        if (res) {

          this.moduleService.getUserModules()

          this.router.navigate(['/']);
        } else {
          this.error = "Invalid login or password"
        }
      } catch (err) {

      } finally {
        this.isSubmitted = false;
      }
    }

  }



  ngOnDestroy(): void {
    const bodyElement = this.renderer.selectRootElement('body', true);
    this.renderer.removeAttribute(bodyElement, 'class');
  }
}

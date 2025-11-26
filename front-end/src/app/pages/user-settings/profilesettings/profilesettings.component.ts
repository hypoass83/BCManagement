import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthentificationService, ChangePasswordRequestDto } from 'src/app/generated';
import { confirmPasswordValidator } from 'src/app/helper/helper-function';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profilesettings',
  templateUrl: './profilesettings.component.html',
  styleUrls: ['./profilesettings.component.scss'],
})
export class ProfilesettingsComponent {



  public changePasswordForm!: FormGroup;
  public error = '';

  isSubmitted = false;

  constructor(
    private authService: AuthService,
    private authentificationService : AuthentificationService,

    private router: Router,
    private formBuilder: FormBuilder,
    private renderer: Renderer2

  ) {

  }


  ngOnInit(): void {

    this.changePasswordForm = this.formBuilder.group({
    password: ['', Validators.required],

    newPassword: ['', [Validators.required, Validators.minLength(8),]],
    confirmPassword: ['', Validators.required],
    },{ validators: confirmPasswordValidator('newPassword', 'confirmPassword') });

  }



  get form() {
    return this.changePasswordForm.controls;
  }

  async Submit() {
    this.isSubmitted = true;

    if (this.changePasswordForm.valid) {

      const changePasswordRequestDto: ChangePasswordRequestDto = {
        newPassword: this.form['newPassword'].value,
        oldPassword: this.form['password'].value,

      }
      try {
        const res = await firstValueFrom( this.authentificationService.authentificationControllerChangePassword(changePasswordRequestDto));

        if (res) {
          this.authService.logout();
        } else {
          this.error = "Wrong old password !!"
        }

      } catch (err) {

      } finally {
        this.isSubmitted = false;
      }
    }

  }



  ngOnDestroy(): void {

  }



}

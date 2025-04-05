import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatTooltip} from '@angular/material/tooltip';
import {ToastrService} from 'ngx-toastr';
import {MatOption, MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [FormsModule, MatFormField, MatButton, MatInput, MatError, MatLabel, MatTooltip, MatSelect, MatOption],
})
export class RegisterComponent {
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: '',
  };

  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router,  private toastr: ToastrService ) {}

  private validateForm(): boolean {

    this.errorMessage = '';


    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.formData.email)) {
      this.errorMessage = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
      return false;
    }

    if (!/^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Za-z\d]).{8,}$/.test(this.formData.password)) {
      this.errorMessage =
        'Das Passwort muss mindestens 8 Zeichen lang sein, eine Zahl, einen Grossbuchstaben und ein Sonderzeichen enthalten.';
      return false;
    }

    return true;
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.validateForm()) {
      return;
    }

    this.authService.register(this.formData).subscribe({
      next: () => {
        this.toastr.success('Registrierung erfolgreich!', 'Erfolg');

        const loginData = { email: this.formData.email, password: this.formData.password };
        this.authService.login(loginData).subscribe({
          next: (response) => {
            this.authService.saveToken(response.token);
            this.toastr.success('Registrierung erfolgreich!', 'Willkommen');
            this.router.navigate(['/inventory']);
          },
          error: () => {
            this.toastr.error(
              'Registrierung erfolgreich, aber automatischer Login fehlgeschlagen.',
              'Fehler'
            );
          },
        });
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Registrierung fehlgeschlagen.';
        this.toastr.error(this.errorMessage, 'Fehler');
      },
    });
  }

}

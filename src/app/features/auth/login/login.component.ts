import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    FormsModule,
    CommonModule,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatTooltip,
    MatTableModule,
    MatError
  ],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {}

  onSubmit() {
    const loginData = { email: this.email, password: this.password };
    this.authService.login(loginData).subscribe({
      next: (response: any) => {
        this.authService.saveToken(response.token);
        this.toastr.success('Erfolgreich eingeloggt!', 'Willkommen');
        console.log('✅ Erfolgreich eingeloggt:', response);
        this.router.navigate(['/inventory']);
      },
      error: (error) => {
        console.error('❌ Fehler beim Login:', error.error);
        this.errorMessage = 'Falsche E-Mail oder Passwort';
        this.toastr.error('Falsche E-Mail oder Passwort', 'Fehler beim Login');
      }
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}

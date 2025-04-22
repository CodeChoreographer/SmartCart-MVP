import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
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
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatTableModule,
    MatError,
    MatAnchor,
    RouterLink
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
        this.router.navigate(['/inventory']);
      },
      error: (error) => {
        this.errorMessage = 'Falsche E-Mail oder Passwort';
        this.toastr.error(this.errorMessage, 'Fehler beim Login');
      }
    });
  }
}

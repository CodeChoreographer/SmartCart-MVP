import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavbarComponent} from './components/navbar/navbar.component';
import {NgIf} from '@angular/common';
import {AuthService} from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    NavbarComponent,
    NgIf
  ],
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private authService: AuthService) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}

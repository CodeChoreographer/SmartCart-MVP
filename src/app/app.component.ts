import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavbarComponent} from './components/navbar/navbar.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    NavbarComponent
  ],
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SmartCart-MVP';
}

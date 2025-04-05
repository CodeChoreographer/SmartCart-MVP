import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    console.log('📤 Daten an Server senden:', data);  // Logge Daten vor dem Senden
    return this.http.post(`${this.apiUrl}/register`, data);
  }


  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const expiryDate = JSON.parse(atob(token.split('.')[1])).exp * 1000;
    return Date.now() < expiryDate;
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}

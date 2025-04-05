// inventory.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InventoryItem {
  id?: number;
  name: string;
  quantity: number;
  unit: string;
  userId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = 'http://localhost:3000/api/inventory';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ Kein Token gefunden!');
      return null;
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getInventory(): Observable<InventoryItem[]> {
    const headers = this.getHeaders();
    if (!headers) return new Observable(observer => observer.error('Kein Token gefunden.'));
    return this.http.get<InventoryItem[]>(this.apiUrl, { headers });
  }

  addItem(data: InventoryItem): Observable<InventoryItem> {
    const headers = this.getHeaders();
    if (!headers) return new Observable(observer => observer.error('Kein Token gefunden.'));
    return this.http.post<InventoryItem>(this.apiUrl, data, { headers });
  }

  updateItem(id: number, data: InventoryItem): Observable<any> {  // NEU HINZUGEFÜGT
    const headers = this.getHeaders();
    if (!headers) return new Observable(observer => observer.error('Kein Token gefunden.'));
    return this.http.put(`${this.apiUrl}/${id}`, data, { headers });
  }

  deleteItem(id: number): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) return new Observable(observer => observer.error('Kein Token gefunden.'));
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}

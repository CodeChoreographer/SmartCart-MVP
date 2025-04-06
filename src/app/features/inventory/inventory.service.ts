import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InventoryItem {
  id?: number;
  name: string;
  quantity: number;
  unit: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = 'https://smartcart.website/api/inventory';

  constructor(private http: HttpClient) {}

  getInventory(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.apiUrl);
  }

  addItem(item: InventoryItem): Observable<any> {
    return this.http.post(this.apiUrl, item);
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateItem(id: number, item: InventoryItem): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, item);
  }
}

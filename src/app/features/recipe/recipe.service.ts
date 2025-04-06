import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  constructor(private http: HttpClient) {}
  private inventoryUrl = 'https://smartcart.website/api/inventory';


  generateRecipe(ingredients: string[], filter: string): Observable<any> {
    return this.http.post('/api/recipes/generate', { ingredients, filter });
  }
  getInventory(): Observable<any[]> {
    return this.http.get<any[]>(this.inventoryUrl);
  }
}



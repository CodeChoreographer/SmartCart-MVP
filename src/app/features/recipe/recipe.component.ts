import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { RecipeService } from './recipe.service';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    RouterLink,
    MatButton
  ]
})
export class RecipeComponent implements OnInit {
  availableIngredients: string[] = [];
  selectedIngredients: string[] = [];
  selectedFilter: string = 'Keine Einschränkung';
  generatedRecipe: string = '';
  isLoading: boolean = false;
  dropdownOpen: boolean = false;

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory() {
    this.recipeService.getInventory().subscribe(
      response => {
        this.availableIngredients = response.map(item => item.name);
        console.log('✅ Zutaten erfolgreich geladen:', this.availableIngredients);
      },
      error => console.error('❌ Fehler beim Laden des Inventars:', error)
    );
  }

  generateRecipe() {
    this.isLoading = true;
    this.generatedRecipe = '';
    this.http.post<any>('https://smartcart.website/api/recipes/generate', {
      ingredients: this.selectedIngredients,
      filter: this.selectedFilter
    }).subscribe(
      response => {
        this.generatedRecipe = response.recipe;
        this.isLoading = false;
        console.log('✅ Rezept erfolgreich geladen:', this.generatedRecipe);
      },
      error => {
        console.error('❌ Fehler beim Laden des Rezepts:', error);
        this.isLoading = false;
      }
    );
  }

  toggleIngredientSelection(ingredient: string) {
    if (this.selectedIngredients.includes(ingredient)) {
      this.selectedIngredients = this.selectedIngredients.filter(i => i !== ingredient);
    } else {
      this.selectedIngredients.push(ingredient);
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectFilter(filter: string) {
    this.selectedFilter = filter;
    this.dropdownOpen = true;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

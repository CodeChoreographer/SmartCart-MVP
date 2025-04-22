import { Component, OnInit } from '@angular/core';
import { RecipeService } from './recipe.service';
import { InventoryService } from '../inventory/inventory.service';
import { ToastrService } from 'ngx-toastr';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  imports: [
    NgIf,
    RouterLink,
    MatButton,
    NgForOf,
  ],
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {
  availableIngredients: string[] = [];
  selectedIngredients: string[] = [];
  selectedFilter: string = 'Keine Einschränkung';
  generatedRecipe: string = '';
  isLoading: boolean = false;
  dropdownOpen:boolean = false;

  constructor(
    private recipeService: RecipeService,
    private inventoryService: InventoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.inventoryService.getInventory().subscribe({
      next: (data: any[]) => {
        this.availableIngredients = data.map(item => item.name);
      },
      error: () => {
        this.toastr.error('Fehler beim Laden der Zutaten', 'Fehler');
      }
    });
  }

  toggleIngredientSelection(ingredient: string): void {
    if (this.selectedIngredients.includes(ingredient)) {
      this.selectedIngredients = this.selectedIngredients.filter(item => item !== ingredient);
    } else {
      this.selectedIngredients.push(ingredient);
    }
  }

  selectFilter(filter: string): void {
    this.selectedFilter = filter;
  }

  generateRecipe(): void {
    this.isLoading = true;

    this.recipeService.generateRecipe({
      selectedIngredients: this.selectedIngredients,
      filter: this.selectedFilter
    }).subscribe({
      next: (response) => {
        this.generatedRecipe = response.recipe;
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Fehler bei der Rezeptgenerierung', 'Fehler');
        this.isLoading = false;
      }
    });
  }


  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }
}

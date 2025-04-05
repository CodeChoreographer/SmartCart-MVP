import { Component, OnInit } from '@angular/core';
import { InventoryService, InventoryItem } from './inventory.service';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../services/auth.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  imports: [
    FormsModule,
    NgIf,
    RouterLink,
    MatButton,
    MatTableModule,
    NgForOf
  ],
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  inventory: InventoryItem[] = [];
  newItem: InventoryItem = { name: '', quantity: 0, unit: '' };
  editItem: InventoryItem | null = null;
  isAdmin: boolean = false;

  constructor(
    private inventoryService: InventoryService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadInventory();
    this.checkAdminStatus();
  }

  loadInventory(): void {
    this.inventoryService.getInventory().subscribe(data => {
      this.inventory = data;
    });
  }

  checkAdminStatus(): void {
    const token = this.authService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.isAdmin = payload.isAdmin || false;
    }
  }

  addItem(): void {
    if (this.newItem.name && this.newItem.quantity && this.newItem.unit) {
      this.inventoryService.addItem(this.newItem).subscribe(() => {
        this.loadInventory();
        this.newItem = { name: '', quantity: 0, unit: '' };
      });
    }
  }

  deleteItem(id: number): void {
    this.inventoryService.deleteItem(id).subscribe(() => {
      this.loadInventory();
    });
  }

  startEdit(item: InventoryItem): void {
    this.editItem = { ...item };
  }

  saveEdit(): void {
    if (this.editItem && this.editItem.id) {
      this.inventoryService.updateItem(this.editItem.id, this.editItem).subscribe(() => {
        this.loadInventory();
        this.editItem = null;
      });
    }
  }

  cancelEdit(): void {
    this.editItem = null;
  }

  logout(): void {
    this.authService.logout();
    this.toastr.error('Erfolgreich abgemeldet!', 'Tschüss');
    this.router.navigate(['/login']);
  }
}

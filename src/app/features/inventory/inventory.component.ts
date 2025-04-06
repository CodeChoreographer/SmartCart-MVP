import { Component, OnInit } from '@angular/core';
import { InventoryService, InventoryItem } from './inventory.service';
import { MatDialog } from '@angular/material/dialog';
import { InventoryEditComponent } from './inventory-edit/inventory-edit.component';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatCard } from '@angular/material/card';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  imports: [
    MatButton,
    RouterLink,
    MatCard,
    MatTable,
    MatHeaderCell,
    MatCell,
    MatColumnDef,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef
  ],
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  inventory: InventoryItem[] = [];
  isAdmin: boolean = false;
  userId: number = 0;

  constructor(
    private inventoryService: InventoryService,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.checkAdminStatus();
    this.loadInventory();
  }

  loadInventory(): void {
    this.inventoryService.getInventory().subscribe(data => {
      this.inventory = data;
    }, error => {
      this.toastr.error('Fehler beim Laden des Inventars', 'Fehler');
    });
  }

  checkAdminStatus(): void {
    const token = this.authService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.isAdmin = payload.isAdmin || false;
      this.userId = payload.userId;  // User ID wird hier gesetzt
    }
  }

  openEditDialog(item?: InventoryItem): void {
    const dialogRef = this.dialog.open(InventoryEditComponent, {
      width: '400px',
      data: item || { name: '', quantity: 0, unit: 'Stück' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (item) {
          this.updateItem(item.id!, result);
        } else {
          this.addItem(result);
        }
      }
    });
  }

  addItem(item: InventoryItem): void {
    item.userId = this.userId; // User ID hinzufügen
    this.inventoryService.addItem(item).subscribe(() => {
      this.loadInventory();
      this.toastr.success('Produkt erfolgreich hinzugefügt', 'Erfolg');
    }, error => {
      this.toastr.error('Fehler beim Hinzufügen des Produkts', 'Fehler');
    });
  }

  updateItem(id: number, updatedItem: InventoryItem): void {
    this.inventoryService.updateItem(id, updatedItem).subscribe(() => {
      this.loadInventory();
      this.toastr.success('Produkt erfolgreich aktualisiert', 'Erfolg');
    }, error => {
      this.toastr.error('Fehler beim Aktualisieren des Produkts', 'Fehler');
    });
  }

  deleteItem(id: number): void {
    this.inventoryService.deleteItem(id).subscribe(() => {
      this.loadInventory();
      this.toastr.success('Produkt erfolgreich gelöscht', 'Erfolg');
    }, error => {
      this.toastr.error('Fehler beim Löschen des Produkts', 'Fehler');
    });
  }
}

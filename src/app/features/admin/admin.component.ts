import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  MatCell,
  MatCellDef, MatColumnDef, MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef, MatTable
} from '@angular/material/table';
import {NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatCard} from '@angular/material/card';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  imports: [
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatHeaderRow,
    MatButton,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatColumnDef,
    MatTable,
    MatCard,
    NgIf
  ],
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
        this.toastr.success('Benutzer erfolgreich geladen', 'Erfolg');
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Fehler beim Laden der Benutzer';
        this.toastr.error(this.errorMessage, 'Fehler');
      }
    });
  }

  confirmDelete(userId: number): void {
    if (confirm('Möchtest du diesen Benutzer wirklich löschen?')) {
      this.deleteUser(userId);
    }
  }

  deleteUser(userId: number): void {
    this.adminService.deleteUser(userId).subscribe({
      next: () => {
        this.successMessage = 'Benutzer erfolgreich gelöscht';
        this.toastr.success(this.successMessage, 'Erfolg');
        this.loadUsers();
      },
      error: (error) => {
        this.errorMessage = 'Fehler beim Löschen des Benutzers';
        this.toastr.error(this.errorMessage, 'Fehler');
      }
    });
  }

  goBack(){
    this.router.navigate(['/inventory']);
  }
}

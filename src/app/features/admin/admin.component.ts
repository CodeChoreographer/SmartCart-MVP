import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import {MatCard} from '@angular/material/card';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  imports: [
    MatButton,
    NgIf,
    MatCard,
    MatTable,
    MatHeaderCell,
    MatColumnDef,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef
  ],
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    const token = this.authService.getToken();
    this.http.get<any[]>('http://localhost:3000/api/admin/users', {
      headers: { Authorization: token || '' }
    }).subscribe({
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
    const token = this.authService.getToken();
    this.http.delete(`http://localhost:3000/api/admin/users/${userId}`, {
      headers: { Authorization: token || '' }
    }).subscribe({
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

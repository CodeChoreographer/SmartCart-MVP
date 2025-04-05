import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle, MatDialogClose
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatButton} from '@angular/material/button';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-inventory-edit',
  templateUrl: './inventory-edit.component.html',
  imports: [
    MatFormField,
    FormsModule,
    MatDialogActions,
    MatButton,
    MatOption,
    MatSelect,
    MatDialogContent,
    MatInput,
    MatLabel,
    MatDialogTitle,
    MatDialogClose,
  ],
  styleUrls: ['./inventory-edit.component.scss']
})
export class InventoryEditComponent {

  constructor(
    public dialogRef: MatDialogRef<InventoryEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService
  ) {}

  onSave() {
    if (this.data.quantity < 1) {
      this.toastr.error('Die Menge darf nicht negativ oder 0 sein!', 'Fehler');
      return;
    }
    if (!this.data.name || !this.data.unit || this.data.quantity === null) {
      this.toastr.error('Bitte fülle alle Felder korrekt aus.', 'Fehler');
      return;
    }
    this.dialogRef.close(this.data);
  }

}

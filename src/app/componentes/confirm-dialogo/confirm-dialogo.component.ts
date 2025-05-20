import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-confirm-dialogo',
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './confirm-dialogo.component.html',
  styleUrl: './confirm-dialogo.component.css'
})
export class ConfirmDialogoComponent {


  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { titulo: string; mensaje: string }
  ) {}

  onAceptar() {
    this.dialogRef.close(true);
  }

  onCancelar() {
    this.dialogRef.close(false);
  }

}

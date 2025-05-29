import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SafePipe } from '../../safe.pipe';
import { MatButtonModule } from '@angular/material/button'; 

@Component({
  selector: 'app-factura-preview',
  standalone: true ,
  imports: [SafePipe,MatButtonModule],
  templateUrl: './factura-preview.component.html',
  styleUrl: './factura-preview.component.css'
})
export class FacturaPreviewComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { pdfUrl: string },
 private dialogRef: MatDialogRef<FacturaPreviewComponent>
) {}

  cerrar(): void {
    this.dialogRef.close();
  }
}

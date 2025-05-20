import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogContent } from '../../pages/productos/productos.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserAuthService } from '../../services/user-auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  standalone: true,
  selector: 'app-spinner-carga',
  imports: [MatProgressSpinnerModule],
  templateUrl: './spinner-carga.component.html',
  styleUrl: './spinner-carga.component.css'
})
export class SpinnerCargaComponent {
 
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserAuthService } from '../../services/user-auth.service';
import { UsuarioNuevo } from '../../modelo/UsuarioNuevo';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-agregar-usuario',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,           // ✅ SnackBar
    MatProgressSpinnerModule 
  ],
  templateUrl: './agregar-usuario.component.html',
  styleUrl: './agregar-usuario.component.css'
})
export class AgregarUsuarioComponent {
  productoForm: FormGroup;
  cargando = false;
  usuarioNuevo : UsuarioNuevo | undefined
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AgregarUsuarioComponent>,
    private snackBar: MatSnackBar,
    public userService: UserAuthService
  ) {
    // Inicializa el formulario con `FormBuilder`
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      Contrasena: ['', Validators.required],
      rol: ['', Validators.required]
    });
  }

  onSubmit() {
  if (this.productoForm.valid) {

    this.cargando = true;

   this.usuarioNuevo = new UsuarioNuevo();
   this.usuarioNuevo.username = this.productoForm.value.nombre
   this.usuarioNuevo.password = this.productoForm.value.Contrasena
   this.usuarioNuevo.rol= this.productoForm.value.rol

    this.userService.postAgregaUsuario(this.usuarioNuevo).subscribe({
        next:(data)=>{

          this.cargando = false;
          this.snackBar.open('Producto agregado exitosamente', 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
          });
          this.close();

        },
        error:(e)=>{
          this.cargando = false;
          console.log(e)
          this.snackBar.open('Error al agregar el producto', 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
          });
          this.close();
        }
      })
  }
}

  close(): void {
    this.dialogRef.close();
  }
}

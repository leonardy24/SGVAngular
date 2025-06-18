import { Component } from '@angular/core';
import { HeaderComponent } from '../../componentes/header/header.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { UserAuthService } from '../../services/user-auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usu } from '../../modelo/Usu';
import { MatDialog } from '@angular/material/dialog';
import { AgregarUsuarioComponent } from '../../componentes/agregar-usuario/agregar-usuario.component';
import { SpinnerCargaComponent } from '../../componentes/spinner-carga/spinner-carga.component';

@Component({
  selector: 'app-personal',
  imports: [
    HeaderComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatTableModule,
    SpinnerCargaComponent
    ],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.css'
})
export class PersonalComponent {
  
  nombreBuscado: string = '';
  usuarioExiste = false;
  cargando = false;
  usuario: Usu | undefined ;

  constructor(
    public userService: UserAuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ){}
  
displayedColumns: string[] = ['Id', 'Nombre', 'Rol'];

  

  buscarUsuario() {
    
    this.cargando = true;
    this.userService.getUsuario(this.nombreBuscado).subscribe({
        next:(data)=>{
          this.cargando = false;
          this.usuario = data;
          this.usuarioExiste = true       
          console.log("existe", data);
        },
        error:(e)=>{
          this.cargando = false;
          this.snackBar.open('Usuario no encontrado!', 'Cerrar', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
        }
      })


  }


  guardarCambio(usuario: any, event: FocusEvent, campo: string) {
    const valor = (event.target as HTMLElement).innerText.trim();
    usuario[campo] = valor;
    
  }


  agregarUsuario(){
        const dialogRef = this.dialog.open(AgregarUsuarioComponent,{
            width: '900px',  // Ajusta el ancho del diálogo
            height: '600px', // Ajusta la altura del diálogo
            data: {} 
          });
    
          dialogRef.afterClosed().subscribe(result => {
            console.log('El diálogo fue cerrado');
            // Puedes manejar después del cierre del diálogo
          });
  }

  guardarUsuario() {

    //PRIMERO VERIFICO QUE EL ROL ES EL CORRECTO,
    if(this.usuario?.rol!='USER' && this.usuario?.rol!='ADMIN'){
        this.cargando = false;
          this.snackBar.open('El ROL debe ser USER o ADMIN!', 'Cerrar', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
            return
    }

    this.userService.actualizarUsuario(this.usuario.id, this.usuario).subscribe({
        next:(data)=>{
          this.cargando = false;
          this.snackBar.open('Usuario Actualizado!', 'Cerrar', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
        },
        error:(e)=>{
          this.cargando = false;
          this.snackBar.open('Usuario no encontrado!', 'Cerrar', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
        }
      })
  }
 
}


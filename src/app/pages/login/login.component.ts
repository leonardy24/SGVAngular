import { Component } from '@angular/core';
import { Form, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserAuthService } from '../../services/user-auth.service';
import { Router } from '@angular/router'; // Importa Router
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerCargaComponent } from '../../componentes/spinner-carga/spinner-carga.component';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,
     MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    SpinnerCargaComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    loginForm: FormGroup;
    username: FormControl;
    password : FormControl;
    loginError: string = '';
    cargando = false;

    constructor(
      public userService: UserAuthService,
      public router: Router,
      private snackBar: MatSnackBar){
      this.username = new FormControl('');
      this.password = new FormControl('');
      
      this.loginForm = new FormGroup({
        username: this.username,
        password: this.password
      });
    }

    inSesion():void{
        this.cargando = true;
        this.userService.postUser(this.loginForm.value).subscribe({
          next:(data)=>{
            this.cargando = false;
            console.log("entro ")
            this.router.navigate(['/ventas']); // Usa router.navigate() para redirigir
          },
          error:(error: HttpErrorResponse)=>{
              this.cargando = false;
              this.snackBar.open('usuario incorrecto o contraseña incorrecta!', 'Cerrar', {
                duration: 5000,
                horizontalPosition: 'right',
                verticalPosition: 'bottom',
            });
          }

        })

    }

}

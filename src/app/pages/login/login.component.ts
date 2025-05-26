import { Component } from '@angular/core';
import { Form, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserAuthService } from '../../services/user-auth.service';
import { Router } from '@angular/router'; // Importa Router
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    loginForm: FormGroup;
    username: FormControl;
    password : FormControl;
    loginError: string = '';

    constructor(public userService: UserAuthService, public router: Router){
      this.username = new FormControl('');
      this.password = new FormControl('');
      
      this.loginForm = new FormGroup({
        username: this.username,
        password: this.password
      });
    }

    inSesion():void{
        
        this.userService.postUser(this.loginForm.value).subscribe({
          next:(data)=>{
            console.log("entro ")
            this.router.navigate(['/ventas']); // Usa router.navigate() para redirigir
          },
          error:(error: HttpErrorResponse)=>{
             if (error.status === 401) {
                 console.log("no entro - Credenciales incorrectas o usuario no autorizado.");
          // Aquí puedes:
          // 1. Mostrar un mensaje al usuario en la UI:
          //    this.mensajeError = "Usuario o contraseña incorrectos.";
          // 2. Resetear el formulario si quieres.
          // 3. No hacer nada más que loguear, si es solo para depuración.
        } else if (error.status === 403) {
          console.log("no entro - Acceso prohibido (403).");
          // this.mensajeError = "No tienes permiso para acceder.";
        } else {
          // Otros errores (500, error de red, etc.)
          console.log("no entro - Ocurrió un error inesperado:", error.message);
          // this.mensajeError = "Ocurrió un error. Inténtalo más tarde.";
        }
          }

        })

    }

}

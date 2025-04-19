import { Component } from '@angular/core';
import { Form, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserAuthService } from '../../services/user-auth.service';
import { Router } from '@angular/router'; // Importa Router

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    loginForm: FormGroup;
    username: FormControl;
    password : FormControl;

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
          error:(e)=>{
            console.log("no entro")
          }

        })

    }

}

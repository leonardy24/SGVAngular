import { Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CanActivate, Router } from '@angular/router';
import { Usu } from '../modelo/Usu';
import { UserAuthService } from '../services/user-auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private usuarioService: UserAuthService,
    private router: Router,
    private snackBar: MatSnackBar) {}

  canActivate(): boolean {
    const usuario = this.usuarioService.getUsuarioActual();

    if (usuario && usuario.rol === 'ADMIN') {
      return true;
    } else {
      this.snackBar.open('Acceso denegado', 'Cerrar', {
                duration: 5000,
                horizontalPosition: 'right',
                verticalPosition: 'bottom',
            });
      this.router.navigate(['/ventas']);
      return false;
    }
  }
}
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SpinnerCargaComponent } from '../../componentes/spinner-carga/spinner-carga.component';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    SpinnerCargaComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  

  constructor(private router: Router) {}

  logout(): void{
    
    // Si guardas algo como el nombre de usuario, límpialo aquí
    localStorage.clear();
    
    // Redirigir a login
    
    this.router.navigate(['/login']);
    
  }
}

import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { VentasComponent } from './pages/ventas/ventas.component';
import { PersonalComponent } from './pages/personal/personal.component';

import { ProductosComponent } from './pages/productos/productos.component';
import { EstadisticasComponent } from './pages/estadisticas/estadisticas.component';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {path: 'ventas', component: VentasComponent},
    {path: 'personal', component: PersonalComponent,canActivate: [AdminGuard]},
    {path:'productos', component: ProductosComponent,canActivate: [AdminGuard]},
    {path:'estadisticas', component: EstadisticasComponent,canActivate: [AdminGuard]}
];

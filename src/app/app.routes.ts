import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { VentasComponent } from './pages/ventas/ventas.component';
import { PersonalComponent } from './pages/personal/personal.component';
import { ProvedoresComponent } from './pages/provedores/provedores.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { EstadisticasComponent } from './pages/estadisticas/estadisticas.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {path: 'ventas', component: VentasComponent},
    {path: 'personal', component: PersonalComponent},
    {path: 'proveedores', component: ProvedoresComponent},
    {path:'productos', component: ProductosComponent},
    {path:'estadisticas', component: EstadisticasComponent}
];

import { Component, OnInit } from '@angular/core'; // OnInit
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Para notificaciones

// Componentes y directivas de gráficos
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartData, ChartEvent, ChartType, BarController, BarElement, CategoryScale, Legend, LinearScale, Title, Tooltip } from 'chart.js';

import { HeaderComponent } from '../../componentes/header/header.component';
import { UserAuthService } from '../../services/user-auth.service';
import { Venta } from '../../modelo/Venta';
import { VentaConFecha } from '../../modelo/VentaConFecha';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);



@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    BaseChartDirective,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule, // Añadir MatSnackBarModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  ],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {

  public salesDateRangeForm: FormGroup;
  public todasLasVentas: VentaConFecha[] = [];
  public ventasFiltradas: VentaConFecha[] = [];
  public displayedColumns: string[] = ['idVenta', 'metodoPago', 'fecha', 'monto', 'Iva', 'idUsuario'];
  public searchAttempted = false;

  // --- Propiedades para el Gráfico de Ventas Mensuales ---
  public showMonthlyChart = false;
  public monthlyChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {},
      y: { min: 0 }
    },
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Ventas Totales por Mes (Filtro Actual)' }
    }
  };
  public monthlyChartLabels: string[] = [];
  public monthlyChartType: ChartType = 'bar';
  public monthlyChartLegend = true;
  public monthlyChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Ventas del Mes', backgroundColor: 'rgba(54, 162, 235, 0.6)', borderColor: 'rgba(54, 162, 235, 1)' }
    ]
  };
  // --- Fin Propiedades Gráfico Mensual ---

  constructor(
    private _snackBar: MatSnackBar,
    public userService: UserAuthService,
    private snackBar: MatSnackBar) { // Inyectar MatSnackBar
    this.salesDateRangeForm = new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null)
    });
  }

  ngOnInit(): void {
    this.cargarVentasDeEjemplo();
    this.ventasFiltradas = []; // Iniciar vacío o con todas, según preferencia
    // this.ventasFiltradas = [...this.todasLasVentas]; // Si quieres mostrar todas al inicio
  }

  cargarVentasDeEjemplo(): void {
    const hoy = new Date();
    /*
    this.todasLasVentas = [
      { id: 1, producto: 'Laptop Pro', fecha: new Date(hoy.getFullYear(), 0, 15), monto: 1200, cliente: 'Ana Pérez' }, // Enero
      { id: 2, producto: 'Mouse Gamer', fecha: new Date(hoy.getFullYear(), 0, 20), monto: 75, cliente: 'Luis García' },   // Enero
      { id: 3, producto: 'Teclado Mec.', fecha: new Date(hoy.getFullYear(), 1, 10), monto: 150, cliente: 'Ana Pérez' },    // Febrero
      { id: 4, producto: 'Monitor 27"', fecha: new Date(hoy.getFullYear(), 1, 22), monto: 300, cliente: 'Carlos Ruiz' },  // Febrero
      { id: 5, producto: 'Webcam HD', fecha: new Date(hoy.getFullYear(), 2, 5), monto: 90, cliente: 'Sofía López' },      // Marzo
      { id: 6, producto: 'SSD 1TB', fecha: new Date(hoy.getFullYear(), 2, 15), monto: 120, cliente: 'Luis García' },      // Marzo
      { id: 7, producto: 'Tablet 10"', fecha: new Date(hoy.getFullYear(), 0, 25), monto: 180, cliente: 'Marcos Gil' },   // Enero
      { id: 8, producto: 'Impresora', fecha: new Date(hoy.getFullYear(), 3, 12), monto: 250, cliente: 'Elena Soler' },    // Abril
    ];
    */
  }

  aplicarFiltroFechas(): void {
    this.searchAttempted = true;
    this.showMonthlyChart = false; // Ocultar gráfico al aplicar nuevo filtro

    const { start, end } = this.salesDateRangeForm.value; //aqui guardo las fechas del formularios

    if (!start && !end) {
      this._snackBar.open('Por favor, seleccione al menos una fecha para filtrar.', 'Cerrar', { duration: 3000 });
      this.ventasFiltradas = []; // O mantener las anteriores, o mostrar todas.
      return;
    }

    // SI LLEGUE HASTA AQUI, ES PORQUE LAS FECHAS SON CORRECTAS
   

    //le paso las fechas directamente en string
    this.userService.getVentasService(start, end).subscribe({
        next:(data)=>{

          //console.log("producto actulizado");
          this.snackBar.open('Producto Actualizado', 'Cerrar', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
            //this.cargando= false, esto es para que me aparezca la cosa de cargando
            this.ventasFiltradas = data;
        },
        error:(e)=>{
          //console.log("error al actualizar el prodcuto")
          this.snackBar.open('ERROR al actualizar el producto', 'Cerrar', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
            //this.cargando= false, esto es para que me aparezca la cosa de cargando
        }
      })
    /*
    let filtered = this.todasLasVentas;
    
    if (start) {
      const startDate = new Date(start);
      startDate.setHours(0, 0, 0, 0); // Inicio del día
      filtered = filtered.filter(venta => new Date(venta.fecha) >= startDate);
    }

    if (end) {
      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999); // Final del día
      filtered = filtered.filter(venta => new Date(venta.fecha) <= endDate);
    }
      */
    //this.ventasFiltradas = filtered;

    if (this.ventasFiltradas.length === 0 && this.searchAttempted) {
        this._snackBar.open('No se encontraron ventas para el rango seleccionado.', 'Cerrar', { duration: 3000 });
    }
  }

  limpiarFiltro(): void {
    this.salesDateRangeForm.reset();
    this.ventasFiltradas = []; // O `[...this.todasLasVentas]` si prefieres mostrar todo
    this.searchAttempted = false;
    this.showMonthlyChart = false; // Ocultar gráfico
  }

  generarGraficoVentasMensuales(): void {
    if (this.ventasFiltradas.length === 0) {
      this._snackBar.open('No hay datos filtrados para generar el gráfico.', 'Cerrar', { duration: 3000 });
      this.showMonthlyChart = false;
      return;
    }

    const ventasPorMes: { [key: string]: number } = {};
    const mesesLabels: { [key: string]: string } = {}; // Para asegurar orden y etiquetas correctas
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    this.ventasFiltradas.forEach(venta => {
      const fecha = new Date(venta.fecha);
      const anio = fecha.getFullYear();
      const mesIndex = fecha.getMonth(); // 0-11
      const claveMesAnio = `${anio}-${mesIndex.toString().padStart(2, '0')}`; // Ej: "2023-00" para Enero

      if (!ventasPorMes[claveMesAnio]) {
        ventasPorMes[claveMesAnio] = 0;
        mesesLabels[claveMesAnio] = `${monthNames[mesIndex]} ${anio}`;
      }
      ventasPorMes[claveMesAnio] += venta.totalVenta;
    });

    const sortedClaves = Object.keys(ventasPorMes).sort();

    const labels: string[] = [];
    const data: number[] = [];

    sortedClaves.forEach(clave => {
      labels.push(mesesLabels[clave]);
      data.push(ventasPorMes[clave]);
    });

    this.monthlyChartLabels = labels; // Aunque ChartData lo usa, es bueno tenerla por si la bindeas
    this.monthlyChartData = {
      labels: labels,
      datasets: [
        {
          ...this.monthlyChartData.datasets[0], // Mantener otras propiedades como color
          data: data,
          label: 'Ventas del Mes'
        }
      ]
    };
    this.showMonthlyChart = true;
  }
}
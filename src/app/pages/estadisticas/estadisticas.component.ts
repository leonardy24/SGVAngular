import { Component, OnInit } from '@angular/core'; // OnInit
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { SpinnerCargaComponent } from '../../componentes/spinner-carga/spinner-carga.component';
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
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    SpinnerCargaComponent
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
  public cargando = false;
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
    private dialog: MatDialog,
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
    this.cargando= true;

    //le paso las fechas directamente en string
    this.userService.getVentasService(start, end).subscribe({
        
        next:(data)=>{
          this.ventasFiltradas = data;
          //console.log("producto actulizado");
          
            this.cargando= false;
            
        },
        error:(e)=>{
          //console.log("error al actualizar el prodcuto")
          this.snackBar.open('ERROR 500', 'Cerrar', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
            this.cargando= false
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

    
  }

  limpiarFiltro(): void {
    this.salesDateRangeForm.reset();
    this.ventasFiltradas = []; // O `[...this.todasLasVentas]` si prefieres mostrar todo
    this.searchAttempted = false;
    this.showMonthlyChart = false; // Ocultar gráfico
  }

  generarPDFDetalleVenta():void{

      
      //this.cargando = true;

      const dialogRef = this.dialog.open(DialogContentId,{
              width: '900px',  // Ajusta el ancho del diálogo
              height: '600px', // Ajusta la altura del diálogo
              data: {} 
            });
      
            dialogRef.afterClosed().subscribe(result => {
              console.log('El diálogo fue cerrado');
              // Puedes manejar después del cierre del diálogo
            });


/*
        console.log(this.cargando)
        this.userService.getGenerarPDFDetalleVenta().subscribe((data: ArrayBuffer) => {

              
              const blob = new Blob([data], { type: 'application/pdf' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'listadoVentas.pdf'; // Nombre del archivo PDF
              a.click();
              window.URL.revokeObjectURL(url);

              this.snackBar.open('PDF descargado', 'Cerrar', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
              
            this.cargando = false
            }, (error) => {
              
              //console.error('Error al generar el reporte:', error);
              this.snackBar.open('ERROR al descargar el pdf', 'Cerrar', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
            this.cargando = false
            });
  */          
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



///COMPONENTE PARA MOSTRAR LA VENTA DE COLOCAR EL ID DE VENTA
@Component({
  selector: 'app-dialog-content-id',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h1 mat-dialog-title>Ingresar ID</h1>
    <div mat-dialog-content>
      <form [formGroup]="idForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="fill">
          <mat-label>ID</mat-label>
          <input matInput formControlName="id" type="text" required>
        </mat-form-field>

        <div mat-dialog-actions>
          <button mat-button type="button" (click)="close()">Cerrar</button>
          <button mat-button type="submit" [disabled]="idForm.invalid">Enviar</button>
        </div>
      </form>

      @if (cargando) {
        <div class="spinner-container">
          <mat-spinner diameter="40" color="primary"></mat-spinner>
        </div>
      }
    </div>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
      margin-bottom: 12px;
    }

    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 16px;
      margin-bottom: 16px;
      min-height: 60px;
    }
  `]
})
export class DialogContentId {
  idForm: FormGroup;
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogContentId>,
    private snackBar: MatSnackBar,
    public userService: UserAuthService,
  ) {
    this.idForm = this.fb.group({
      id: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.idForm.valid) {
      this.cargando = true;
      const id = this.idForm.value.id;

       this.userService.getGenerarPDFDetalleVenta(id).subscribe((data: ArrayBuffer) => {

              
              const blob = new Blob([data], { type: 'application/pdf' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'listadoVentas.pdf'; // Nombre del archivo PDF
              a.click();
              window.URL.revokeObjectURL(url);

              this.snackBar.open('PDF descargado', 'Cerrar', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
              
            this.cargando = false
            }, (error) => {
              
              //console.error('Error al generar el reporte:', error);
              this.snackBar.open('ERROR al descargar el pdf', 'Cerrar', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
            this.cargando = false
            });

      /*
      // Aquí iría tu lógica para usar el ID ingresado, por ejemplo una llamada a API
      setTimeout(() => {  // Simulando una petición
        this.cargando = false;
        this.snackBar.open(`ID ${id} enviado correctamente`, 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
        });
        this.close();
      }, 1500);
      */
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}

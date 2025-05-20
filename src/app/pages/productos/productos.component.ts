import { Component } from '@angular/core';
import { HeaderComponent } from '../../componentes/header/header.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Producto } from '../../modelo/Producto';
import { UserAuthService } from '../../services/user-auth.service';
import { ProductoExistencia } from '../../modelo/ProductoExistencia';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogoComponent } from '../../componentes/confirm-dialogo/confirm-dialogo.component';
import { SpinnerCargaComponent } from '../../componentes/spinner-carga/spinner-carga.component';

@Component({
  selector: 'app-productos',
  imports: [
    HeaderComponent,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatCardModule,MatIconModule,
    MatFormFieldModule,MatInputModule,
    MatButtonModule,
    SpinnerCargaComponent
   ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {
  
  productosExistencia: ProductoExistencia ;
  
  codidoForm: FormGroup;
  codigo: FormControl;
  cargando = false;

  constructor(
    public userService: UserAuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private spinnerCarga: MatDialog
    ){
    this.codigo = new FormControl('');
    this.productosExistencia = new ProductoExistencia();
      this.codidoForm = new FormGroup({
        codigo: this.codigo
      });

    }

    buscarCodigo():void{

      this.cargando = true;
      console.log(this.codidoForm.value.codigo);
      this.userService.getProductoStock(this.codidoForm.value.codigo).subscribe({
        next:(data)=>{
          this.cargando = false;
          this.productosExistencia = data       
          console.log("existe", data);
        },
        error:(e)=>{
          this.cargando = false;
          this.snackBar.open('Producto no encontrado!', 'Cerrar', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
        }
      })

  }

    eliminar(idProducto: number){

      //INVESTIGAR ANGULAR MATERIA PARA LOS POP, ES MUCHO MEJOR
      console.log(idProducto)
      //const confirmar = window.confirm('¿Estás seguro de que querés eliminar este producto?');

      const dialogRef = this.dialog.open(ConfirmDialogoComponent, {
        data: {
        titulo: '¿Estás seguro?',
       mensaje: '¿Deseas eliminar este producto? Esta acción no se puede deshacer.'
      }
      });

      dialogRef.afterClosed().subscribe(resultado => {
      if (resultado === true) {
        // El usuario aceptó
       
        this.userService.deleteProducto(idProducto).subscribe({
          next:(data)=>{
              this.snackBar.open('Producto eliminado', 'Cerrar', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
          
            console.log("producto eliminado");
          },
          error:(e)=>{
             this.snackBar.open('Error al eliminar el producto', 'Cerrar', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
            console.log("error al eliminar el producto")
          }
        })
      
      } else {
        // El usuario canceló
        console.log('Eliminación cancelada');
      }
      });

      
      
    }


    getArray(cant: number) {
      return Array(cant);
    }

    guardarCambioLocal(producto: ProductoExistencia, event: any, campo: string){

      const nuevoValor = event.target.innerText.trim();

      // actualizás el campo dinámicamente
      (producto as any)[campo] = nuevoValor;

      console.log('Nuevo valor:', nuevoValor);
      console.log('Producto actualizado:', producto);
      console.log(this.productosExistencia)
    }

    guardar(){
      
      this.cargando= true
      this.userService.postUpdateProducto(this.productosExistencia).subscribe({
        next:(data)=>{

          //console.log("producto actulizado");
          this.snackBar.open('Producto Actualizado', 'Cerrar', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
            this.cargando= false
        },
        error:(e)=>{
          //console.log("error al actualizar el prodcuto")
          this.snackBar.open('ERROR al actualizar el producto', 'Cerrar', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
            this.cargando= false
        }
      })
    }

    agregarProducto(){

      const dialogRef = this.dialog.open(DialogContent,{
        width: '900px',  // Ajusta el ancho del diálogo
        height: '600px', // Ajusta la altura del diálogo
        data: {} 
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('El diálogo fue cerrado');
        // Puedes manejar después del cierre del diálogo
      });


    }

    generarPDF(){

      
      this.cargando = true;
      console.log(this.cargando)
      this.userService.getGenerarPDF().subscribe((data: ArrayBuffer) => {

              
              const blob = new Blob([data], { type: 'application/pdf' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'listadoProductos.pdf'; // Nombre del archivo PDF
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
             
    }
}

@Component({
  selector: 'app-dialog-content',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,           // ✅ SnackBar
    MatProgressSpinnerModule   
  ],
  template: `
    <h1 mat-dialog-title>Agregar producto</h1>
    <div mat-dialog-content>
     

      <form [formGroup]="productoForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="fill">
          <mat-label>Cantidad</mat-label>
          <input matInput formControlName="cantidad" type="number" required>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Código</mat-label>
          <input matInput formControlName="codigo" type="text" required>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Nombre del Producto</mat-label>
          <input matInput formControlName="nombreProducto" type="text" required>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Precio Costo</mat-label>
          <input matInput formControlName="precioCosto" type="number" required>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Precio Venta</mat-label>
          <input matInput formControlName="precioVenta" type="number" required>
        </mat-form-field>

        <div mat-dialog-actions>
          <button mat-button type="button" (click)="close()">Cerrar</button>
          <button mat-button type="submit" [disabled]="productoForm.invalid">Enviar</button>
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
      margin-top: 16px;  /* Espacio arriba */
      margin-bottom: 16px; /* Espacio abajo */
      min-height: 60px;
    }


  `]
})

export class DialogContent {
  productoForm: FormGroup;
  cargando = false;
  productoNuevo : ProductoExistencia | undefined;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogContent>,
    private snackBar: MatSnackBar,
    public userService: UserAuthService
  ) {
    // Inicializa el formulario con `FormBuilder`
    this.productoForm = this.fb.group({
      cantidad: ['', [Validators.required, Validators.min(1)]],
      codigo: ['', Validators.required],
      nombreProducto: ['', Validators.required],
      precioCosto: ['', [Validators.required, Validators.min(0)]],
      precioVenta: ['', [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit() {
  if (this.productoForm.valid) {

    this.cargando = true;

   this.productoNuevo = new ProductoExistencia();
   this.productoNuevo.cantidad = this.productoForm.value.cantidad
   this.productoNuevo.codigo = this.productoForm.value.codigo
   this.productoNuevo.nomProducto = this.productoForm.value.nombreProducto
   this.productoNuevo.precioCosto = this.productoForm.value.precioCosto
   this.productoNuevo.precioVenta = this.productoForm.value.precioVenta

    this.userService.postAgregarProducto(this.productoNuevo).subscribe({
        next:(data)=>{

          this.cargando = false;
          this.snackBar.open('Producto agregado exitosamente', 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
          });
          this.close();

        },
        error:(e)=>{
          this.cargando = false;
          this.snackBar.open('Error al agregar el producto', 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
          });
          this.close();
        }
      })
  }
}

  close(): void {
    this.dialogRef.close();
  }
}
import { Component } from '@angular/core';
import { HeaderComponent } from '../../componentes/header/header.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserAuthService } from '../../services/user-auth.service';
import { Producto } from '../../modelo/Producto';

import { Venta } from '../../modelo/Venta';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { FacturaPreviewComponent } from '../../componentes/factura-preview/factura-preview.component';
import { SpinnerCargaComponent } from '../../componentes/spinner-carga/spinner-carga.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ventas',
  imports: [HeaderComponent,
            MatButtonModule,
            MatIconModule,
            MatButtonToggleModule,
            ReactiveFormsModule,
            FormsModule,
            MatFormFieldModule,
            MatInputModule,
            MatCardModule,
            SpinnerCargaComponent],
  standalone: true,
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent {
  
  codidoForm: FormGroup;
  codigo: FormControl;
  productos: Producto[];
  cargando = false;
  totalVenta: number;
  iva: number;
  efectivoCambio: number;
  metodoDePago : string;
  venta: Venta = {
      metodoPago: '',
      totalVenta: 0,
      iva: 0,
      productos: []
  };


  constructor(
    public userService: UserAuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar){
    this.productos = [];
    
    this.codigo = new FormControl('');
    this.totalVenta = 0;
    this.iva = 0;
    this.efectivoCambio =0 ;
    this.metodoDePago = "tarjeta";
    this.codidoForm = new FormGroup({
      codigo: this.codigo
    });
  }


  buscarCodigo():void{
      this.cargando = true;
      console.log(this.codidoForm.value.codigo);
      this.userService.getProducto(this.codidoForm.value.codigo).subscribe({
        next:(data)=>{
          this.cargando = false;
          this.productos.push(data);
          this.totalVenta = this.getTotalVenta();
          
          console.log("existe", data);
        },
        error:(e)=>{
          console.log("no existe")
          this.cargando = false;
          this.snackBar.open('Producto no encontrado!', 'Cerrar', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
        }
      })

  }

  eliminar(i : number){
    
    this.productos.splice(i,1)
    this.totalVenta = this.getTotalVenta();
  }

  getTotalVenta(): number {
    return this.productos.reduce((total, producto) => {
      return total + (producto.precio * producto.cantidad);
    }, 0);
  }

  geIvaTotal(){

    const iva= this.iva = this.getTotalVenta() *0.21;

    return Math.round(iva * 100) / 100;;
  }

  getCambio(): number{

     const cambio = this.efectivoCambio - this.getTotalVenta();
     return Math.round(cambio * 100) / 100;
  }


  pagar(){

  
     this.venta={
      metodoPago: this.metodoDePago,
      totalVenta: this.totalVenta,
      iva: this.iva,
      productos: this.productos
    }

    this.cargando= true;
    this.userService.getRegistroVenta(this.venta).subscribe({
       next: (pdfBlob: Blob) => {
        this.cargando= false;
        const pdfUrl = URL.createObjectURL(pdfBlob);
        this.dialog.open(FacturaPreviewComponent, {
          data: { pdfUrl: pdfUrl },
          width: '80%',
          height: '90%'
        });

      this.venta={
        metodoPago: '',
        totalVenta: 0,
        iva: 0,
        productos: []
      }
      
      this.metodoDePago= '';
      this.totalVenta= 0;
      this.iva = 0;
      this.productos=[];

      },
      error: (err) => {
        console.error("Error al registrar venta o generar factura", err);
        this.cargando = false;
          this.snackBar.open('Error al registrar la venta!', 'Cerrar', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
      }
    })

  }



}

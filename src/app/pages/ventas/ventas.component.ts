import { Component } from '@angular/core';
import { HeaderComponent } from '../../componentes/header/header.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserAuthService } from '../../services/user-auth.service';
import { Producto } from '../../modelo/Producto';

import { Venta } from '../../modelo/Venta';


@Component({
  selector: 'app-ventas',
  imports: [HeaderComponent, ReactiveFormsModule,FormsModule],
  standalone: true,
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent {
  
  codidoForm: FormGroup;
  codigo: FormControl;
  productos: Producto[];
 
  totalVenta: number;
  iva: number;
  efectivoCambio: number;
  metodoDePago : string;

  constructor(public userService: UserAuthService){
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
      console.log(this.codidoForm.value.codigo);
      this.userService.getProducto(this.codidoForm.value.codigo).subscribe({
        next:(data)=>{
          
          this.productos.push(data);
          this.totalVenta = this.getTotalVenta();
          
          console.log("existe", data);
        },
        error:(e)=>{
          console.log("no existe")
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

    this.iva = this.getTotalVenta() *0.21;

    return this.iva;
  }

  getCambio(): number{

    return this.efectivoCambio - this.getTotalVenta();
  }


  pagar(){

    //podriasmos hacer una ventana que me salga con los todos los datos de compra y aceptar o cancelar, pero de momento
    //lo voy hacer dierectio


    const venta: Venta ={
      metodoPago: this.metodoDePago,
      totalVenta: this.totalVenta,
      iva: this.iva,
      productos: this.productos
    }

    
    this.userService.getRegistroVenta(venta).subscribe({
      next:(data)=>{
        
        console.log("pago realizado", );
      },
      error:(e)=>{
        console.log("pago no se realizo")
      }
    })

  }

  
  

}

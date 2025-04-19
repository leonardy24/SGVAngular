import { Component } from '@angular/core';
import { HeaderComponent } from '../../componentes/header/header.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Producto } from '../../modelo/Producto';
import { UserAuthService } from '../../services/user-auth.service';
import { ProductoExistencia } from '../../modelo/ProductoExistencia';


@Component({
  selector: 'app-productos',
  imports: [HeaderComponent,ReactiveFormsModule,FormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {
  
  productosExistencia: ProductoExistencia[];

  datos = [
    { tipo: 'Coche' },
    { tipo: 'Camión' },
    { tipo: 'Bicicleta' }
  ];

  codidoForm: FormGroup;
  codigo: FormControl;


  constructor(public userService: UserAuthService){
    this.codigo = new FormControl('');
    this.productosExistencia = [];
      this.codidoForm = new FormGroup({
        codigo: this.codigo
      });
    }

    buscarCodigo():void{
      console.log(this.codidoForm.value.codigo);
      this.userService.getProductoStock(this.codidoForm.value.codigo).subscribe({
        next:(data)=>{
          
          this.productosExistencia.push(data);
          
          
          console.log("existe", data);
        },
        error:(e)=>{
          console.log("no existe")
        }
      })

  }

    eliminar(index: number){

    }
}

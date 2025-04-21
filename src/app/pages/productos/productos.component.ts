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
  
  productosExistencia: ProductoExistencia ;
  codidoForm: FormGroup;
  codigo: FormControl;


  constructor(public userService: UserAuthService){
    this.codigo = new FormControl('');
    this.productosExistencia = new ProductoExistencia();
      this.codidoForm = new FormGroup({
        codigo: this.codigo
      });
    }

    buscarCodigo():void{
      console.log(this.codidoForm.value.codigo);
      this.userService.getProductoStock(this.codidoForm.value.codigo).subscribe({
        next:(data)=>{
          
          this.productosExistencia = data;
          
          
          console.log("existe", data);
        },
        error:(e)=>{
          console.log("no existe")
        }
      })

  }

    eliminar(idProducto: number){

      //INVESTIGAR ANGULAR MATERIA PARA LOS POP, ES MUCHO MEJOR
      console.log(idProducto)
      const confirmar = window.confirm('¿Estás seguro de que querés eliminar este producto?');

      if(confirmar){
        this.userService.deleteProducto(idProducto).subscribe({
          next:(data)=>{
  
            console.log("producto eliminado");
          },
          error:(e)=>{
            console.log("error al eliminar el producto")
          }
        })
      }
      
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
      
      
      this.userService.postUpdateProducto(this.productosExistencia).subscribe({
        next:(data)=>{

          console.log("producto actulizado");
        },
        error:(e)=>{
          console.log("error al actualizar el prodcuto")
        }
      })
    }
}

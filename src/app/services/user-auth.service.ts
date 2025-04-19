import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../modelo/Usuario';
import { Producto } from '../modelo/Producto';
import { Venta } from '../modelo/Venta';
import { ProductoExistencia } from '../modelo/ProductoExistencia';


@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  API_URL ='http://localhost:8080/auth';


  constructor(private http: HttpClient) {
    
   }

   //POST para verificar la existencia del usuario
   postUser(usu: Usuario){
      return this.http.post<any>(`${this.API_URL}/login`, usu);
   }

   //GET para verificar si existe el codigo en la base de de datos
   
   getProducto(codigo: number){
      return this.http.get<Producto>(`${this.API_URL}/buscador/${codigo}`);
   }


   
   getProductoStock(codigo: number){
      return this.http.get<ProductoExistencia>(`${this.API_URL}/buscadorStock/${codigo}`);
   }

   getRegistroVenta(venta: Venta){

    return this.http.post<any>(`${this.API_URL}/registroVenta`,venta);
   }

}

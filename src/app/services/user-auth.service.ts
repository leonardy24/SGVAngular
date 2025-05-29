import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../modelo/Usuario';
import { Producto } from '../modelo/Producto';
import { Venta } from '../modelo/Venta';
import { ProductoExistencia } from '../modelo/ProductoExistencia';
import { VentaConFecha } from '../modelo/VentaConFecha';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  API_URL ='http://localhost:8080/auth';

   usuario: Usuario | undefined;
   
  constructor(private http: HttpClient) {
   
   }

   //POST para verificar la existencia del usuario
   postUser(usu: Usuario){
      this.usuario= usu;
      console.log(usu.username)
      console.log(usu.password)
      
      const headers = this.getbase64Credenciales();

      return this.http.post<any>(`${this.API_URL}/login`,{},{ headers });
   }


   //POST para agregar un nuevo elemento

   postAgregarProducto(productoNuevo: ProductoExistencia){

      const headers = this.getbase64Credenciales();

      return this.http.post<any>(`${this.API_URL}/agregarProducto`,productoNuevo,{headers})
   }

   postUpdateProducto(productoActualizado: ProductoExistencia){
      const headers = this.getbase64Credenciales();
      return this.http.post<any>(`${this.API_URL}/actualizarProducto`,productoActualizado,{headers})
   }

   deleteProducto(idProductoEliminar: number){

      const headers = this.getbase64Credenciales();
      return this.http.delete(`${this.API_URL}/productoEliminar/${idProductoEliminar}`,{headers})
   }

   //GET para verificar si existe el codigo en la base de de datos
   
   getProducto(codigo: number){
      const headers = this.getbase64Credenciales();
      return this.http.get<Producto>(`${this.API_URL}/buscador/${codigo}`,{headers});
   }


   
   getProductoStock(codigo: number){
      const headers = this.getbase64Credenciales();
      return this.http.get<ProductoExistencia>(`${this.API_URL}/buscadorStock/${codigo}`,{headers});
   }
   
   getGenerarPDF(){
      const headers = this.getbase64Credenciales();
      return this.http.get(`${this.API_URL}/generarPDFProductos/${0}`,{responseType: 'arraybuffer',headers});
   }

   getGenerarPDFDetalleVenta(id :number){
      const headers = this.getbase64Credenciales();
      return this.http.get(`${this.API_URL}/generarPDFVenta/${id}`,{responseType: 'arraybuffer',headers});
   }

   //generarPDF(codigo: number) {
     // const headers = this.getbase64Credenciales();
      //return this.http.get(`/generarPDF/${codigo}`, { responseType: 'arraybuffer',headers })
      
  //}

   getRegistroVenta(venta: Venta): Observable<Blob> {
      const headers = this.getbase64Credenciales();
      return this.http.post(`${this.API_URL}/registroVenta`, venta, {
      headers,
      responseType: 'blob' // 👈 IMPORTANTE: indicar que esperas un blob
  });
}


   getbase64Credenciales(){
      const base64Credenciales = btoa(this.usuario?.username + ':' + this.usuario?.password);
      const headers = new HttpHeaders({
      'Authorization': 'Basic ' + base64Credenciales
    });

    return headers;
   }

   getVentasService(fechaInicio: string, fechaFin: string){
      const headers = this.getbase64Credenciales();


      const fechaInicioFormateada = new Date(fechaInicio).toISOString().split('T')[0]; // "2025-05-01"
      const fechaFinFormateada = new Date(fechaFin).toISOString().split('T')[0];
      const params = {
         fechaInicio: fechaInicioFormateada,
         fechaFinPar: fechaFinFormateada
      };

      return this.http.get<VentaConFecha[]>(`${this.API_URL}/ventas`,{
         headers,
         params
      });

   }

}

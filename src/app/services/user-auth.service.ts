import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Producto } from '../modelo/Producto';
import { Venta } from '../modelo/Venta';
import { ProductoExistencia } from '../modelo/ProductoExistencia';
import { VentaConFecha } from '../modelo/VentaConFecha';
import { Observable } from 'rxjs';
import { Usu } from '../modelo/Usu';
import { UsuarioNuevo } from '../modelo/UsuarioNuevo';
import { UsuarioLogin } from '../modelo/UsuarioLogin';


@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
   //API_URL ='http://localhost:8080/auth';
   API_URL = 'http://ec2-15-188-65-191.eu-west-3.compute.amazonaws.com:8080/auth'
   usuario: UsuarioLogin | undefined;
   
   usuDTO : Usu | undefined;

  constructor(private http: HttpClient) {
   
   }

   //POST para verificar la existencia del usuario
   postUser(usu: UsuarioLogin){
      this.usuario= usu;
      console.log(usu.username)
      console.log(usu.password)
      
      const headers = this.getbase64Credenciales();
      
      return this.http.post<Usu>(`${this.API_URL}/login`,{},{ headers });
       
   }

   //ESTE METODO LO UTILIZO PARA GUARDAR EL VALOR DEL USUARIO,
   //PARA VERIFICAR QUE ROL TIENE, Y PODER ACCEDER A LAS DEMAS PAGINAS
   getGuardarUsuario(usuDTO: Usu){
      this.usuDTO = usuDTO;
   }

   //RETORNA EL USUARIO ACTUAL
   getUsuarioActual(){
      return this.usuDTO;
   }


   //POST para agregar un nuevo elemento

   postAgregarProducto(productoNuevo: ProductoExistencia){

      const headers = this.getbase64Credenciales();

      return this.http.post<any>(`${this.API_URL}/agregarProducto`,productoNuevo,{headers})
   }

   //POST agregar usuario

   postAgregaUsuario(usuario:UsuarioNuevo){

      const headers = this.getbase64Credenciales();

      return this.http.post<any>(`${this.API_URL}/register`,usuario,{headers})
   }

   //PUT ACTUALIZAR USUARIO
   actualizarUsuario(id:number, usuarioActualizado:Usu){

      const headers = this.getbase64Credenciales();

      return this.http.put<any>(`${this.API_URL}/actualizarUsuario/${id}`,usuarioActualizado,{headers})
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

   getUsuario(nomUsuario: string){
      const headers = this.getbase64Credenciales();
      return this.http.get<Usu>(`${this.API_URL}/buscadorusuario/${nomUsuario}`,{headers});
   
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

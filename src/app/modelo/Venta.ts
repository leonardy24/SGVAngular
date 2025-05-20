import { Producto } from "./Producto";

export interface Venta {
    metodoPago: string;
    totalVenta: number;
    iva: number;
    productos: Producto[];
    }
  
   
//src/store/cartStore.ts
import { create } from 'zustand';

// 1. Definimos cómo es un Producto que viene de la base de datos
export interface Producto {
  id: string;
  nombre: string;
  marca: string;
  precioBase: number;
  requiereImei: boolean;
  moneda: 'BOB' | 'USD';
  ram?: string;
  almacenamiento?: string;
  descripcion?: string;
  stock?: number; // <--- ¡AGREGA ESTA LÍNEA!
  // (El resto de campos que ya tenías como cantidad, precioFinal, etc.)
  cantidad: number;
  precioFinal: number;
  imei1?: string;
  imei2?: string;
}

// 2. Definimos cómo es ese producto una vez que entra al carrito
export interface ItemCarrito extends Producto {
  cantidad: number;
  precioFinal: number; // Precio después de un posible regateo
  imei1?: string;
  imei2?: string;
}

// 3. Definimos todo lo que nuestro Store puede hacer
interface CartState {
  carrito: ItemCarrito[];
  totalVenta: number;
  
  agregarProducto: (producto: Producto) => void;
  eliminarProducto: (id: string) => void;
  actualizarCantidad: (id: string, cantidad: number) => void;
  actualizarPrecioFinal: (id: string, nuevoPrecio: number) => void;
  actualizarImei: (id: string, imei1: string, imei2?: string) => void;
  limpiarCarrito: () => void;
}

// Función auxiliar para recalcular el total sumando (precioFinal * cantidad)
const calcularTotal = (carrito: ItemCarrito[]) => {
  return carrito.reduce((total, item) => total + (item.precioFinal * item.cantidad), 0);
};

// 4. Creamos y exportamos el Store mágico
export const useCartStore = create<CartState>((set) => ({
  carrito: [],
  totalVenta: 0,

  agregarProducto: (producto) => set((state) => {
    // Revisamos si el producto ya está en el carrito
    const existe = state.carrito.find(item => item.id === producto.id);
    
    let nuevoCarrito;
    if (existe && !producto.requiereImei) {
      // Si existe y NO es un celular (ej. audífonos), solo sumamos 1 a la cantidad
      nuevoCarrito = state.carrito.map(item => 
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      );
    } else {
      // Si es nuevo (o es un celular, que debe ir en filas separadas por el IMEI), lo agregamos al final
      // Nota: Si es celular y ya existe, lo ideal es agregarlo como una fila nueva para pedir otro IMEI
      const nuevoItem: ItemCarrito = { 
        ...producto, 
        cantidad: 1, 
        precioFinal: producto.precioBase // Inicia sin regateo
      };
      nuevoCarrito = [...state.carrito, nuevoItem];
    }

    return { 
      carrito: nuevoCarrito, 
      totalVenta: calcularTotal(nuevoCarrito) 
    };
  }),

  eliminarProducto: (id) => set((state) => {
    const nuevoCarrito = state.carrito.filter(item => item.id !== id);
    return { carrito: nuevoCarrito, totalVenta: calcularTotal(nuevoCarrito) };
  }),

  actualizarCantidad: (id, cantidad) => set((state) => {
    if (cantidad < 1) return state; // Evitamos cantidades negativas o cero
    const nuevoCarrito = state.carrito.map(item => 
      item.id === id ? { ...item, cantidad } : item
    );
    return { carrito: nuevoCarrito, totalVenta: calcularTotal(nuevoCarrito) };
  }),

  actualizarPrecioFinal: (id, nuevoPrecio) => set((state) => {
    const nuevoCarrito = state.carrito.map(item => 
      item.id === id ? { ...item, precioFinal: nuevoPrecio } : item
    );
    return { carrito: nuevoCarrito, totalVenta: calcularTotal(nuevoCarrito) };
  }),

  actualizarImei: (id, imei1, imei2) => set((state) => {
    const nuevoCarrito = state.carrito.map(item => 
      item.id === id ? { ...item, imei1, imei2 } : item
    );
    return { carrito: nuevoCarrito }; // El IMEI no afecta el total
  }),

  limpiarCarrito: () => set({ carrito: [], totalVenta: 0 })
}));
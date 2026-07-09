import { create } from 'zustand';

// 1. Definimos el Producto base de MongoDB
export interface Producto {
  id: string;
  nombre: string;
  marca: string;
  descripcion?: string;
  precioBase: number;
  requiereImei: boolean;
  moneda: string;
  ram?: string;
  almacenamiento?: string;
  stock?: number;
}

// 2. Definimos cómo es el producto cuando entra al carrito (ItemCarrito)
export interface CartItem extends Producto {
  cartItemId: string; // <--- LA CLAVE MÁGICA: Identificador ÚNICO por fila
  cantidad: number;
  precioFinal: number;
  imei1?: string;
  imei2?: string;
}

// 3. Definimos las acciones del Store
interface CartStore {
  carrito: CartItem[];
  totalVenta: number;
  agregarProducto: (producto: Producto) => void;
  eliminarProducto: (cartItemId: string) => void; // Eliminamos por la Fila Única
  actualizarCantidad: (cartItemId: string, cantidad: number) => void;
  actualizarPrecioFinal: (cartItemId: string, precio: number) => void;
  actualizarImei: (cartItemId: string, imei1: string, imei2?: string) => void;
  limpiarCarrito: () => void;
}

// FUNCIÓN AUXILIAR ESTRICTAMENTE TIPADA (Afuera del store para evitar errores de TS)
const calcularTotal = (carrito: CartItem[]): number => {
  return carrito.reduce((total: number, item: CartItem) => total + (item.precioFinal * item.cantidad), 0);
};

// 4. Creamos el Store
export const useCartStore = create<CartStore>((set) => ({
  carrito: [],
  totalVenta: 0,

  agregarProducto: (producto) => {
    set((state) => {
      // Generamos un ID único para cada clic en "+". 
      // Esto diferencia un "iPhone 1" de un "iPhone 2"
      const cartItemId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
      
      if (producto.requiereImei) {
        // Los celulares SIEMPRE crean una fila nueva independiente
        const nuevoCarrito = [...state.carrito, { ...producto, cartItemId, cantidad: 1, precioFinal: producto.precioBase }];
        return { carrito: nuevoCarrito, totalVenta: calcularTotal(nuevoCarrito) };
      } else {
        // Los accesorios se agrupan sumando cantidad
        const existe = state.carrito.find(item => item.id === producto.id);
        if (existe) {
          const nuevoCarrito = state.carrito.map(item => 
            item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
          );
          return { carrito: nuevoCarrito, totalVenta: calcularTotal(nuevoCarrito) };
        } else {
          const nuevoCarrito = [...state.carrito, { ...producto, cartItemId, cantidad: 1, precioFinal: producto.precioBase }];
          return { carrito: nuevoCarrito, totalVenta: calcularTotal(nuevoCarrito) };
        }
      }
    });
  },

  eliminarProducto: (cartItemId) => {
    set((state) => {
      // Ahora solo borra la fila exacta que seleccionaste (la "X")
      const nuevoCarrito = state.carrito.filter(item => item.cartItemId !== cartItemId);
      return { carrito: nuevoCarrito, totalVenta: calcularTotal(nuevoCarrito) };
    });
  },

  actualizarCantidad: (cartItemId, cantidad) => {
    if (cantidad < 1) return {}; 
    set((state) => {
      const nuevoCarrito = state.carrito.map(item => item.cartItemId === cartItemId ? { ...item, cantidad } : item);
      return { carrito: nuevoCarrito, totalVenta: calcularTotal(nuevoCarrito) };
    });
  },

  actualizarPrecioFinal: (cartItemId, precio) => {
    set((state) => {
      const nuevoCarrito = state.carrito.map(item => item.cartItemId === cartItemId ? { ...item, precioFinal: precio } : item);
      return { carrito: nuevoCarrito, totalVenta: calcularTotal(nuevoCarrito) };
    });
  },

  actualizarImei: (cartItemId, imei1, imei2) => {
    set((state) => ({
      carrito: state.carrito.map(item => item.cartItemId === cartItemId ? { ...item, imei1, imei2 } : item)
    }));
  },

  limpiarCarrito: () => set({ carrito: [], totalVenta: 0 }),
}));
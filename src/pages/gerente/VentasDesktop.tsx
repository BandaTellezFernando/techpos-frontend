import { useState, useEffect, useCallback, useRef } from 'react';
import { useCartStore, type Producto } from '../../store/cartStore';
import { Smartphone, Headphones, Receipt, ShoppingCart, Edit3, X, Search, ChevronLeft, User, Banknote, QrCode, CreditCard, AlertTriangle, ScanLine, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios'; 
import { generarTicketPDF } from '../../utils/pdfGenerator'; // <-- IMPORT PDF
import ScannerModal from '../../components/ScannerModal';     // <-- IMPORT ESCÁNER

interface ProductoAPI {
  _id: string;
  nombre: string;
  marca: string;
  descripcion?: string;
  precioFinalBob: number;
  tipoProducto: string;
  ram?: string;
  almacenamiento?: string;
  stock: number;
}

export default function VentasDesktop() {
  const [tabActiva, setTabActiva] = useState<'smartphones' | 'accesorios'>('smartphones');
  const [vistaDerecha, setVistaDerecha] = useState<'carrito' | 'checkout'>('carrito');
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'qr' | 'tarjeta' | null>(null);
  const [carritoAbiertoMobile, setCarritoAbiertoMobile] = useState(false);

  // NUEVO ESTADO PARA EL ESCÁNER
  const [scannerAbierto, setScannerAbierto] = useState<{ idItem: string, campo: 'imei1' | 'imei2' } | null>(null);

  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [procesandoVenta, setProcesandoVenta] = useState(false);
  const [toast, setToast] = useState<{mensaje: string, tipo: 'exito' | 'error'} | null>(null);

  const peticionEnCurso = useRef(false);
  const { carrito, totalVenta, agregarProducto, eliminarProducto, actualizarCantidad, actualizarPrecioFinal, actualizarImei, limpiarCarrito } = useCartStore();
  
  const faltanImeis = carrito.some(item => item.requiereImei && (!item.imei1 || item.imei1.trim() === ''));

  const mostrarNotificacion = (mensaje: string, tipo: 'exito' | 'error') => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 4000); 
  };

  const cargarInventario = useCallback(async () => {
    try {
      setCargando(true);
      const response = await api.get('/productos');
      const productosAjustados = response.data.productos.map((p: ProductoAPI) => ({
        id: p._id, nombre: p.nombre, marca: p.marca, descripcion: p.descripcion,
        precioBase: p.precioFinalBob, requiereImei: p.tipoProducto === 'Celular',
        moneda: 'BOB', ram: p.ram, almacenamiento: p.almacenamiento, stock: p.stock
      }));
      setProductos(productosAjustados);
    } catch (error) {
      console.error(error);
      mostrarNotificacion('Error de conexión con el servidor.', 'error');
    } finally {
      setCargando(false);
    }
  }, []); 

  useEffect(() => {
    setTimeout(() => { cargarInventario(); }, 0);
  }, [cargarInventario]); 

  const confirmarVenta = async () => {
    if (!metodoPago || peticionEnCurso.current) return;
    try {
      peticionEnCurso.current = true;
      setProcesandoVenta(true);
      
      const detalle = carrito.map(item => ({
        productoId: item.id,
        tipoProducto: item.requiereImei ? 'Celular' : 'Accesorio',
        nombreProducto: item.nombre,
        imeiVendido: item.requiereImei ? item.imei1 : undefined,
        cantidad: item.cantidad,
        precioUnitarioVenta: item.precioFinal,
        subtotal: item.precioFinal * item.cantidad
      }));

      const metodoFormateado = metodoPago === 'tarjeta' ? 'Tarjeta' : metodoPago === 'qr' ? 'QR' : 'Efectivo';

      await api.post('/ventas', { detalle, metodoPago: metodoFormateado, clienteInfo: 'Cliente Mostrador' });

      // <-- MAGIA DEL PDF: Lo abrimos en una nueva pestaña -->
      const numeroDeTicket = "V-" + Date.now().toString().slice(-4);
      generarTicketPDF(numeroDeTicket, carrito, totalVenta, metodoFormateado);

      mostrarNotificacion('¡Venta registrada con éxito!', 'exito');
      limpiarCarrito();
      setVistaDerecha('carrito');
      setMetodoPago(null);
      setCarritoAbiertoMobile(false);
      cargarInventario(); 
    } catch (error) {
      const err = error as { response?: { data?: { mensaje?: string } } };
      mostrarNotificacion(err.response?.data?.mensaje || 'Error al confirmar la venta.', 'error');
    } finally {
      setProcesandoVenta(false);
      peticionEnCurso.current = false; 
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-full animate-fade-in bg-ruby-bgLight dark:bg-ruby-bgDark transition-colors relative overflow-hidden">
      
      {toast && (
        <div className={`absolute top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-xl shadow-2xl font-bold text-sm animate-fade-in ${toast.tipo === 'error' ? 'bg-ruby-accent text-white' : 'bg-emerald-500 text-white'}`}>
          {toast.tipo === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          {toast.mensaje}
        </div>
      )}

      {/* --- PANEL IZQUIERDO --- */}
      <div className="flex-1 flex flex-col p-4 lg:p-8 overflow-hidden pb-24 lg:pb-8">
        <div className="flex justify-between items-start mb-6 lg:mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold">Nueva Venta</h2>
            <p className="opacity-70 mt-1 text-sm lg:text-base">martes, 07 de julio de 2026</p>
          </div>
          <div className="hidden lg:flex items-center gap-2 bg-ruby-panelLight dark:bg-ruby-panelDark px-4 py-2 rounded-full border border-ruby-textLight/10 dark:border-ruby-textDark/10 shadow-sm transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-ruby-accent"></span>
            <span className="text-sm font-semibold opacity-80">Gerente · Modo Venta</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:items-center">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            <button onClick={() => setTabActiva('smartphones')} className={`whitespace-nowrap flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${tabActiva === 'smartphones' ? 'border-2 border-ruby-accent text-ruby-accent bg-ruby-accent/10 shadow-[0_0_15px_rgba(225,29,72,0.15)]' : 'border border-ruby-textLight/20 dark:border-ruby-textDark/20 opacity-70 bg-ruby-panelLight dark:bg-transparent shadow-sm'}`}>
              <Smartphone size={18} /> Smartphones 
            </button>
            <button onClick={() => setTabActiva('accesorios')} className={`whitespace-nowrap flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${tabActiva === 'accesorios' ? 'border-2 border-ruby-accent text-ruby-accent bg-ruby-accent/10 shadow-[0_0_15px_rgba(225,29,72,0.15)]' : 'border border-ruby-textLight/20 dark:border-ruby-textDark/20 opacity-70 bg-ruby-panelLight dark:bg-transparent shadow-sm'}`}>
              <Headphones size={18} /> Accesorios 
            </button>
          </div>
          <div className="flex-1 relative w-full">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
            <input type="text" placeholder="Buscar producto..." className="w-full bg-ruby-panelLight dark:bg-[#261C1D] border border-ruby-textLight/10 dark:border-white/5 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-ruby-accent transition-colors shadow-sm" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          {cargando ? (
            <div className="flex h-full items-center justify-center opacity-50 font-bold animate-pulse">Conectando con el inventario...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
              {productos.filter(p => tabActiva === 'smartphones' ? p.requiereImei : !p.requiereImei).map((producto) => (
                <div key={producto.id} className={`bg-white dark:bg-[#261C1D] border border-ruby-textLight/10 dark:border-white/5 p-4 lg:p-5 rounded-2xl flex flex-col justify-between transition-colors group shadow-sm hover:border-ruby-accent/30 ${producto.stock === 0 ? 'opacity-50 grayscale' : ''}`}>
                  <div>
                    <div className="flex justify-between items-start mb-3 lg:mb-4">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-ruby-bgLight dark:bg-white/5 flex items-center justify-center text-ruby-textLight/60 dark:text-white border border-ruby-textLight/5 dark:border-white/5">
                        {producto.requiereImei ? <Smartphone size={18} /> : <Headphones size={18} />}
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <span className="text-[10px] font-bold bg-black/5 dark:bg-white/10 px-2 py-1 rounded">Stock: {producto.stock}</span>
                      </div>
                    </div>
                    <p className="text-[10px] opacity-60 uppercase tracking-widest font-bold mb-1">{producto.marca}</p>
                    <h3 className="font-bold text-sm lg:text-lg leading-tight mb-3">{producto.nombre}</h3>
                  </div>
                  <div className="flex justify-between items-end mt-4 pt-3 border-t border-ruby-textLight/5 dark:border-white/5">
                    <p className="text-ruby-priceLight dark:text-ruby-priceDark font-mono text-base lg:text-xl font-bold">Bs. {producto.precioBase}</p>
                    <button 
                      disabled={producto.stock === 0}
                      onClick={() => agregarProducto(producto)} 
                      className="text-xl lg:text-2xl font-black text-white bg-ruby-accent w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-lg hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-[0_4px_15px_rgba(225,29,72,0.4)] disabled:opacity-30 disabled:shadow-none disabled:hover:scale-100 disabled:bg-gray-400"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 w-full p-4 bg-ruby-panelLight dark:bg-ruby-panelDark border-t border-ruby-textLight/10 dark:border-white/5 z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
        <button onClick={() => setCarritoAbiertoMobile(true)} className="w-full bg-ruby-accent text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg shadow-ruby-accent/30">
          <ShoppingCart size={20} /> Ver Carrito ({carrito.length}) - Bs. {totalVenta.toFixed(2)}
        </button>
      </div>

      {/* --- PANEL DERECHO: CARRITO --- */}
      <aside className={`fixed inset-0 z-50 lg:relative lg:z-10 w-full lg:w-[450px] bg-white dark:bg-[#1E1717] lg:border-l border-ruby-textLight/10 dark:border-white/5 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${carritoAbiertoMobile ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}`}>
        
        {vistaDerecha === 'carrito' && (
          <>
            <div className="p-4 lg:p-6 border-b border-ruby-textLight/5 dark:border-white/5 flex justify-between items-center bg-ruby-bgLight/50 dark:bg-black/20 lg:bg-transparent pt-8 lg:pt-6">
              <h2 className="text-xl font-bold flex items-center gap-2"><Receipt size={24} /> Carrito</h2>
              <div className="flex items-center gap-3">
                <span className="bg-ruby-textLight/5 dark:bg-white/5 px-3 py-1 rounded-full text-xs font-bold opacity-70">{carrito.length} ítems</span>
                <button onClick={() => setCarritoAbiertoMobile(false)} className="lg:hidden p-2 rounded-full bg-black/5 dark:bg-white/5 opacity-70 hover:opacity-100">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
              {carrito.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                  <ShoppingCart size={64} strokeWidth={1.5} className="mb-4" />
                  <p className="font-bold text-lg">El carrito está vacío</p>
                  <p className="text-sm mt-2">Agrega productos desde el catálogo.</p>
                </div>
              ) : (
                carrito.map((item) => {
                  const imeiLleno = item.imei1 && item.imei1.trim() !== '';
                  return (
                    <div key={item.cartItemId} className="border border-ruby-textLight/10 dark:border-white/5 rounded-2xl p-4 lg:p-5 bg-ruby-bgLight/50 dark:bg-black/20 shadow-sm relative">
                      <div className="flex justify-between items-start mb-4 pr-10">
                        <div className="flex gap-3 items-center">
                          <div className="w-10 h-10 rounded-lg bg-ruby-textLight/5 dark:bg-white/5 flex items-center justify-center border border-ruby-textLight/5 dark:border-white/5">
                            {item.requiereImei ? <Smartphone size={20} className="opacity-70"/> : <Headphones size={20} className="opacity-70"/>}
                          </div>
                          <div>
                            <h4 className="font-bold text-base leading-tight mb-1">{item.nombre}</h4>
                            <p className="text-[10px] opacity-60 uppercase tracking-widest">{item.marca}</p>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => eliminarProducto(item.cartItemId)} 
                          className="absolute top-4 lg:top-5 right-4 lg:right-5 w-8 h-8 flex items-center justify-center rounded-full bg-ruby-accent/10 text-ruby-accent hover:bg-ruby-accent hover:text-white transition-all shadow-[0_0_10px_rgba(225,29,72,0.2)] hover:shadow-[0_4px_15px_rgba(225,29,72,0.4)]"
                        >
                          <X size={16} strokeWidth={3} />
                        </button>
                      </div>

                      {!item.requiereImei && (
                        <div className="flex items-center gap-2 bg-white dark:bg-transparent border border-ruby-textLight/10 dark:border-white/10 rounded-lg px-2 py-1 w-max mb-4">
                          <button onClick={() => actualizarCantidad(item.cartItemId, item.cantidad - 1)} className="opacity-50 hover:opacity-100 font-bold px-1">—</button>
                          <span className="font-bold text-sm w-4 text-center">{item.cantidad}</span>
                          <button onClick={() => actualizarCantidad(item.cartItemId, item.cantidad + 1)} className="opacity-50 hover:opacity-100 font-bold px-1">+</button>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs opacity-60">Precio unitario:</span>
                        <div className="flex items-center gap-1 group">
                          <Edit3 size={12} className="opacity-0 group-hover:opacity-50 transition-opacity" />
                          <input type="number" value={item.precioFinal} onChange={(e) => actualizarPrecioFinal(item.cartItemId, Number(e.target.value))} className="w-20 text-right bg-transparent outline-none font-mono font-bold text-lg text-ruby-priceLight dark:text-ruby-priceDark border-b border-transparent focus:border-ruby-accent transition-colors" />
                        </div>
                      </div>

                      {item.requiereImei && (
                        <div className="space-y-3 mt-4 pt-4 border-t border-ruby-textLight/10 dark:border-white/5">
                          <p className={`text-[10px] font-bold tracking-widest uppercase mb-3 flex items-center gap-2 ${imeiLleno ? 'text-emerald-500' : 'text-ruby-accent'}`}>
                            IMEI DEL EQUIPO · {imeiLleno ? 'REGISTRADO ✓' : 'IMEI 1 OBLIGATORIO'}
                          </p>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 text-xs font-bold">[ ]</span>
                              <input type="text" placeholder="IMEI 1 — obligatorio" value={item.imei1 || ''} onChange={(e) => actualizarImei(item.cartItemId, e.target.value, item.imei2)} className={`w-full bg-white dark:bg-black/20 border rounded-xl py-3 lg:py-2 pl-10 pr-3 text-xs lg:text-sm font-mono outline-none transition-colors ${imeiLleno ? 'border-emerald-500/50 text-emerald-600 dark:text-emerald-500 focus:border-emerald-500' : 'border-ruby-accent/50 text-ruby-accent focus:border-ruby-accent'} shadow-inner`} />
                            </div>
                            <button onClick={() => setScannerAbierto({ idItem: item.cartItemId, campo: 'imei1' })} className="bg-white dark:bg-black/20 border border-ruby-textLight/10 dark:border-white/10 rounded-xl w-14 lg:w-12 flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-ruby-accent/10 hover:text-ruby-accent hover:border-ruby-accent/50">
                              <ScanLine size={18} />
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 text-xs font-bold">[ ]</span>
                              <input type="text" placeholder="IMEI 2 — opcional" value={item.imei2 || ''} onChange={(e) => actualizarImei(item.cartItemId, item.imei1 || '', e.target.value)} className="w-full bg-white dark:bg-black/20 border border-ruby-textLight/10 dark:border-white/10 rounded-xl py-3 lg:py-2 pl-10 pr-3 text-xs lg:text-sm font-mono outline-none focus:border-ruby-textLight/30 dark:focus:border-white/30 transition-all" />
                            </div>
                            <button onClick={() => setScannerAbierto({ idItem: item.cartItemId, campo: 'imei2' })} className="bg-white dark:bg-black/20 border border-ruby-textLight/10 dark:border-white/10 rounded-xl w-14 lg:w-12 flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-ruby-accent/10 hover:text-ruby-accent hover:border-ruby-accent/50">
                              <ScanLine size={18} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 lg:p-6 border-t border-ruby-textLight/10 dark:border-white/5 bg-ruby-bgLight/30 dark:bg-black/10">
              <div className="flex justify-between items-end mb-4 lg:mb-6">
                <span className="text-sm font-bold opacity-60">Total a Cobrar</span>
                <span className="font-mono font-black text-2xl lg:text-3xl text-ruby-priceLight dark:text-ruby-priceDark">Bs. {totalVenta.toFixed(2)}</span>
              </div>
              
              {faltanImeis ? (
                <button disabled className="w-full bg-ruby-panelLight dark:bg-ruby-panelDark border border-ruby-accent/30 text-ruby-accent/50 py-4 rounded-xl font-bold text-lg lg:text-xl flex justify-center items-center gap-2 cursor-not-allowed">
                  <AlertTriangle size={24} /> Faltan IMEIs
                </button>
              ) : (
                <button disabled={carrito.length === 0} onClick={() => setVistaDerecha('checkout')} className="w-full bg-ruby-accent text-white py-4 rounded-xl font-bold text-lg lg:text-xl hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 transition-all shadow-lg shadow-ruby-accent/20">
                  COBRAR
                </button>
              )}
            </div>
          </>
        )}

        {vistaDerecha === 'checkout' && (
          <>
            <header className="flex justify-between items-center p-4 lg:p-6 border-b border-ruby-textLight/10 dark:border-white/5 bg-ruby-bgLight/30 dark:bg-black/10 pt-8 lg:pt-6">
              <button onClick={() => setVistaDerecha('carrito')} className="text-ruby-textLight dark:text-ruby-textDark opacity-70 hover:opacity-100 flex items-center gap-2 transition-opacity">
                <ChevronLeft size={24} />
                <h2 className="font-bold text-lg">Confirmar Venta</h2>
              </button>
              <span className="font-mono font-bold text-ruby-textLight/50 dark:text-ruby-textDark/50 text-sm">Bs. {totalVenta.toFixed(2)}</span>
            </header>

            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              <h3 className="text-[10px] font-bold opacity-50 tracking-widest uppercase mb-3 flex items-center gap-2"><User size={14} /> DATOS DEL CLIENTE (opcional)</h3>
              <div className="mb-6 lg:mb-8 space-y-3">
                <input type="text" placeholder="Nombre completo" className="w-full bg-ruby-bgLight dark:bg-ruby-bgDark border border-ruby-textLight/10 dark:border-white/5 rounded-xl py-3 px-4 text-sm outline-none focus:border-ruby-accent transition-colors shadow-sm" />
                <div className="flex gap-3">
                  <input type="text" placeholder="C.I." className="w-1/2 bg-ruby-bgLight dark:bg-ruby-bgDark border border-ruby-textLight/10 dark:border-white/5 rounded-xl py-3 px-4 text-sm outline-none focus:border-ruby-accent transition-colors shadow-sm" />
                  <input type="text" placeholder="Teléfono" className="w-1/2 bg-ruby-bgLight dark:bg-ruby-bgDark border border-ruby-textLight/10 dark:border-white/5 rounded-xl py-3 px-4 text-sm outline-none focus:border-ruby-accent transition-colors shadow-sm" />
                </div>
              </div>

              <h3 className="text-[10px] font-bold opacity-50 tracking-widest uppercase mb-3">RESUMEN DE PRODUCTOS</h3>
              <div className="space-y-3 mb-6 lg:mb-8">
                {carrito.map((item) => (
                  <div key={item.cartItemId} className="bg-white dark:bg-[#261C1D] border border-ruby-textLight/10 dark:border-white/5 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-ruby-bgLight dark:bg-white/5 flex items-center justify-center text-ruby-textLight/60 dark:text-white border border-ruby-textLight/5 dark:border-white/5">
                        {item.requiereImei ? <Smartphone size={20} /> : <Headphones size={20} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm leading-none mb-1">{item.nombre}</h4>
                        {item.requiereImei && item.imei1 && (
                          <div className="text-[10px] opacity-60 font-mono mt-1">
                            <p>IMEI 1: {item.imei1}</p>
                            {item.imei2 && <p>IMEI 2: {item.imei2}</p>}
                          </div>
                        )}
                        {!item.requiereImei && <p className="text-[10px] opacity-60 font-bold">Cant: {item.cantidad}</p>}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-sm text-ruby-priceLight dark:text-ruby-priceDark">Bs. {item.precioFinal}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white dark:bg-[#261C1D] border border-ruby-textLight/10 dark:border-white/5 rounded-2xl p-5 mb-6 lg:mb-8 shadow-sm">
                <div className="flex justify-between items-center border-b border-ruby-textLight/5 dark:border-white/5 pb-3 mb-3">
                  <span className="opacity-60 text-sm">Subtotal</span>
                  <span className="font-mono font-bold text-sm">Bs. {totalVenta.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-black text-xl tracking-wide">TOTAL</span>
                  <span className="font-mono font-black text-2xl text-ruby-priceLight dark:text-ruby-priceDark">Bs. {totalVenta.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <button onClick={() => setMetodoPago('efectivo')} className={`py-4 lg:py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-2 border transition-all ${metodoPago === 'efectivo' ? 'bg-ruby-accent/10 border-ruby-accent text-ruby-accent' : 'bg-ruby-panelLight dark:bg-ruby-panelDark border-ruby-textLight/10 dark:border-white/5 opacity-70'}`}><Banknote size={20} /> <span className="text-xs">Efectivo</span></button>
                <button onClick={() => setMetodoPago('qr')} className={`py-4 lg:py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-2 border transition-all ${metodoPago === 'qr' ? 'bg-ruby-accent/10 border-ruby-accent text-ruby-accent' : 'bg-ruby-panelLight dark:bg-ruby-panelDark border-ruby-textLight/10 dark:border-white/5 opacity-70'}`}><QrCode size={20} /> <span className="text-xs">QR</span></button>
                <button onClick={() => setMetodoPago('tarjeta')} className={`py-4 lg:py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-2 border transition-all ${metodoPago === 'tarjeta' ? 'bg-ruby-accent/10 border-ruby-accent text-ruby-accent' : 'bg-ruby-panelLight dark:bg-ruby-panelDark border-ruby-textLight/10 dark:border-white/5 opacity-70'}`}><CreditCard size={20} /> <span className="text-xs">Tarjeta</span></button>
              </div>
            </div>

            <div className="p-4 lg:p-6 border-t border-ruby-textLight/10 dark:border-white/5 bg-ruby-bgLight/30 dark:bg-black/10">
              <button disabled={!metodoPago || procesandoVenta} onClick={confirmarVenta} className="w-full bg-ruby-accent text-white py-4 rounded-xl font-black text-lg shadow-[0_10px_30px_rgba(239,68,68,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none flex justify-center items-center">
                {procesandoVenta ? 'Procesando...' : 'Confirmar Venta'}
              </button>
            </div>
          </>
        )}
      </aside>

      {/* --- EL MODAL DE LA CÁMARA (Lector de Códigos) --- */}
      {scannerAbierto && (
        <ScannerModal 
          onClose={() => setScannerAbierto(null)} 
          onScan={(texto) => {
            const itemEnCarrito = carrito.find(i => i.cartItemId === scannerAbierto.idItem);
            if (itemEnCarrito) {
              actualizarImei(
                scannerAbierto.idItem, 
                scannerAbierto.campo === 'imei1' ? texto : (itemEnCarrito.imei1 || ''), 
                scannerAbierto.campo === 'imei2' ? texto : (itemEnCarrito.imei2 || '')
              );
            }
            setScannerAbierto(null);
          }} 
        />
      )}
    </div>
  );
}
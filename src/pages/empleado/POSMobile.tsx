import { useState, useEffect, useCallback, useRef } from 'react';
import { useCartStore, type Producto } from '../../store/cartStore';
import { Search, Smartphone, Headphones, ShoppingCart, ChevronLeft, CreditCard, Banknote, QrCode, X, Edit3, AlertTriangle, ScanLine, CheckCircle2, LogOut } from 'lucide-react';
import api from '../../api/axios';
import { generarTicketPDF } from '../../utils/pdfGenerator';
import ScannerModal from '../../components/ScannerModal';

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

export default function POSMobile() {
  const [tabActiva, setTabActiva] = useState<'smartphones' | 'accesorios'>('smartphones');
  const [vistaActual, setVistaActual] = useState<'catalogo' | 'checkout'>('catalogo');
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'qr' | null>(null);
  
  const [scannerAbierto, setScannerAbierto] = useState<{ idItem: string, campo: 'imei1' | 'imei2' } | null>(null);

  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [procesandoVenta, setProcesandoVenta] = useState(false);
  const [toast, setToast] = useState<{mensaje: string, tipo: 'exito' | 'error'} | null>(null);

  const peticionEnCurso = useRef(false);

  const { carrito, totalVenta, agregarProducto, eliminarProducto, actualizarImei, actualizarPrecioFinal, actualizarCantidad, limpiarCarrito } = useCartStore();
  const faltanImeis = carrito.some(item => item.requiereImei && (!item.imei1 || item.imei1.trim() === ''));

  const mostrarNotificacion = (mensaje: string, tipo: 'exito' | 'error') => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 4000);
  };

  // NUESTRA FUNCIÓN LOCAL Y SEGURA PARA CERRAR SESIÓN (EMPLEADO)
  const handleLogout = () => {
    localStorage.clear();
    window.location.replace('/');
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

      await api.post('/ventas', {
        detalle,
        metodoPago: metodoPago === 'qr' ? 'QR' : 'Efectivo',
        clienteInfo: 'Cliente Móvil' 
      });

      const numeroDeTicket = "V-" + Date.now().toString().slice(-4);
      generarTicketPDF(numeroDeTicket, carrito, totalVenta, metodoPago === 'qr' ? 'QR' : 'Efectivo');

      mostrarNotificacion('¡Venta registrada con éxito!', 'exito');
      limpiarCarrito();
      setVistaActual('catalogo');
      setMetodoPago(null);
      cargarInventario(); 
    } catch (error) {
      const err = error as { response?: { data?: { mensaje?: string } } };
      console.error('Error al procesar la venta:', error);
      mostrarNotificacion(err.response?.data?.mensaje || 'Error al confirmar la venta.', 'error');
    } finally {
      setProcesandoVenta(false);
      peticionEnCurso.current = false;
    }
  };

  const toastElement = toast ? (
    <div className={`fixed top-4 left-4 right-4 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl font-bold text-sm animate-fade-in ${toast.tipo === 'error' ? 'bg-ruby-accent text-white' : 'bg-emerald-500 text-white'}`}>
      {toast.tipo === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
      {toast.mensaje}
    </div>
  ) : null;

  if (vistaActual === 'catalogo') {
    return (
      <div className="flex flex-col h-full animate-fade-in w-full bg-ruby-bgLight dark:bg-ruby-bgDark relative transition-colors">
        {toastElement}
        <div className="flex-1 flex flex-col overflow-hidden pt-4 px-4 pb-32">
          
          {/* HEADER DEL EMPLEADO CON BOTÓN DE CERRAR SESIÓN INTEGRADO */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold opacity-60">POS Móvil</h2>
            <button onClick={handleLogout} className="p-2 bg-black/5 dark:bg-white/5 rounded-full hover:bg-ruby-accent hover:text-white transition-all shadow-sm">
              <LogOut size={20} />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 mb-2 snap-x hide-scrollbar mt-2">
            <button onClick={() => setTabActiva('smartphones')} className={`snap-start whitespace-nowrap px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${tabActiva === 'smartphones' ? 'border-2 border-ruby-accent text-ruby-accent bg-ruby-accent/10 shadow-[0_0_15px_rgba(225,29,72,0.15)]' : 'border border-ruby-textLight/20 dark:border-ruby-textDark/20 opacity-70'}`}>
              <Smartphone size={18} /> Smartphones 
            </button>
            <button onClick={() => setTabActiva('accesorios')} className={`snap-start whitespace-nowrap px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${tabActiva === 'accesorios' ? 'border-2 border-ruby-accent text-ruby-accent bg-ruby-accent/10 shadow-[0_0_15px_rgba(225,29,72,0.15)]' : 'border border-ruby-textLight/20 dark:border-ruby-textDark/20 opacity-70'}`}>
              <Headphones size={18} /> Accesorios 
            </button>
          </div>

          <div className="relative mb-6">
            <input type="text" placeholder="Buscar producto..." className="w-full bg-ruby-panelLight dark:bg-ruby-panelDark border border-ruby-textLight/20 dark:border-ruby-textDark/20 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-ruby-accent transition-colors shadow-sm" />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" size={20} />
          </div>

          <div className="flex-1 overflow-y-auto">
            {cargando ? (
              <p className="text-center opacity-50 font-bold mt-10">Cargando inventario...</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 pb-6">
                {productos.filter(p => tabActiva === 'smartphones' ? p.requiereImei : !p.requiereImei).map((producto) => {
                  const stockActual = producto.stock ?? 0;
                  return (
                    <div key={producto.id} onClick={() => stockActual > 0 && agregarProducto(producto)} className={`bg-ruby-panelLight dark:bg-ruby-panelDark border border-ruby-textLight/10 dark:border-ruby-textDark/10 p-4 rounded-2xl flex flex-col justify-between transition-colors shadow-sm ${stockActual > 0 ? 'active:border-ruby-accent active:bg-ruby-accent/5 cursor-pointer select-none hover:border-ruby-accent/30' : 'opacity-40 grayscale cursor-not-allowed'}`}>
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-sm border border-black/5 dark:border-white/5">
                            {producto.requiereImei ? <Smartphone size={16} /> : <Headphones size={16} />}
                          </div>
                          <span className="text-[10px] font-bold bg-black/5 dark:bg-white/10 px-2 py-1 rounded">Stock: {stockActual}</span>
                        </div>
                        <p className="text-[10px] opacity-60 uppercase font-bold tracking-widest">{producto.marca}</p>
                        <h3 className="font-bold text-base leading-tight mt-1 mb-3">{producto.nombre}</h3>
                      </div>
                      <div className="mt-2 flex justify-between items-end border-t border-ruby-textLight/10 dark:border-white/5 pt-3">
                        <p className="text-ruby-priceLight dark:text-ruby-priceDark font-mono text-sm font-bold">Bs. {producto.precioBase}</p>
                        <button className="text-lg font-black text-white bg-ruby-accent w-8 h-8 flex items-center justify-center rounded-lg shadow-[0_4px_15px_rgba(225,29,72,0.4)] pointer-events-none">+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 w-full bg-ruby-panelLight dark:bg-ruby-panelDark rounded-t-3xl border-t border-ruby-textLight/10 dark:border-ruby-textDark/10 z-30 p-5 shadow-[0_-20px_40px_rgba(0,0,0,0.1)] transition-colors">
          {carrito.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-4">
              <span className="bg-ruby-accent text-white px-3 py-1 rounded-full text-xs font-bold mb-4">Ticket de Venta</span>
              <ShoppingCart className="opacity-20 mb-2" size={48} strokeWidth={1.5} />
              <p className="opacity-50 text-sm font-bold">Tu carrito está vacío</p>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="bg-ruby-accent/20 text-ruby-accent px-3 py-1 rounded-full text-xs font-bold">Ticket de Venta</span>
                <span className="bg-black/5 dark:bg-white/10 px-3 py-1 rounded-full text-xs font-bold">{carrito.length} ítems</span>
              </div>
              <div className="w-full flex justify-between items-end mb-4">
                <span className="font-bold opacity-60">TOTAL</span>
                <span className="font-mono font-black text-3xl text-ruby-priceLight dark:text-ruby-priceDark">Bs. {totalVenta.toFixed(2)}</span>
              </div>
              <button onClick={() => setVistaActual('checkout')} className="w-full bg-ruby-accent text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-ruby-accent/30 flex justify-center items-center gap-2">
                <CreditCard size={20} /> COBRAR
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-fade-in w-full bg-ruby-bgLight dark:bg-ruby-bgDark relative z-50 transition-colors">
      {toastElement}
      <header className="flex justify-between items-center p-5 bg-ruby-panelLight dark:bg-ruby-panelDark border-b border-ruby-textLight/10 dark:border-white/5 transition-colors">
        <button onClick={() => setVistaActual('catalogo')} className="text-ruby-textLight dark:text-ruby-textDark opacity-70 hover:opacity-100 flex items-center gap-2">
          <ChevronLeft size={24} />
          <h2 className="font-bold text-lg">Confirmar Venta</h2>
        </button>
        <span className="bg-black/5 dark:bg-white/10 px-3 py-1 rounded-full text-xs font-bold opacity-70">{carrito.length} ítems</span>
      </header>

      <div className="flex-1 overflow-y-auto p-5 pb-40">
        <h3 className="text-[10px] font-bold opacity-50 tracking-widest uppercase mb-3">PRODUCTOS</h3>
        <div className="space-y-4 mb-8">
          {carrito.map((item) => {
            const imeiLleno = item.imei1 && item.imei1.trim() !== '';
            return (
              <div key={item.cartItemId} className="bg-ruby-panelLight dark:bg-ruby-panelDark border border-ruby-textLight/10 dark:border-white/5 rounded-2xl p-4 shadow-sm relative transition-colors">
                
                <button 
                  onClick={() => eliminarProducto(item.cartItemId)} 
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-ruby-accent/10 text-ruby-accent hover:bg-ruby-accent hover:text-white transition-all shadow-[0_0_10px_rgba(225,29,72,0.2)] hover:shadow-[0_4px_15px_rgba(225,29,72,0.4)]"
                >
                  <X size={16} strokeWidth={3} />
                </button>

                <div className="flex items-center gap-3 mb-4 pr-10">
                  <div className="w-10 h-10 rounded-lg bg-ruby-accent/10 text-ruby-accent flex items-center justify-center border border-ruby-accent/20">
                    {item.requiereImei ? <Smartphone size={20} /> : <Headphones size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-base leading-none mb-1">{item.nombre}</h4>
                    <p className="text-[10px] opacity-60 uppercase tracking-widest">{item.marca}</p>
                  </div>
                </div>

                {!item.requiereImei && (
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-ruby-textLight/10 dark:border-white/5">
                    <span className="text-[10px] opacity-50 uppercase font-bold">Cantidad</span>
                    <div className="flex items-center gap-3 bg-ruby-bgLight dark:bg-ruby-bgDark px-3 py-1.5 rounded-lg border border-ruby-textLight/10 dark:border-white/10">
                      <button onClick={() => actualizarCantidad(item.cartItemId, item.cantidad - 1)} className="opacity-50 font-bold px-2">—</button>
                      <span className="font-bold text-sm w-4 text-center">{item.cantidad}</span>
                      <button onClick={() => actualizarCantidad(item.cartItemId, item.cantidad + 1)} className="opacity-50 font-bold px-2">+</button>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mb-4 pb-4 border-b border-ruby-textLight/10 dark:border-white/5">
                  <span className="text-[10px] opacity-50 uppercase font-bold">Precio Final</span>
                  <div className="flex items-center gap-2 group bg-ruby-bgLight dark:bg-ruby-bgDark px-3 py-1.5 rounded-lg border border-ruby-textLight/10 dark:border-white/10">
                    <Edit3 className="opacity-50" size={12} />
                    <input type="number" value={item.precioFinal} onChange={(e) => actualizarPrecioFinal(item.cartItemId, Number(e.target.value))} className="w-20 text-right bg-transparent outline-none font-mono font-bold text-ruby-priceLight dark:text-ruby-priceDark" />
                  </div>
                </div>

                {item.requiereImei && (
                  <div>
                    <p className={`text-[10px] font-bold tracking-widest uppercase mb-3 flex items-center gap-2 ${imeiLleno ? 'text-emerald-500' : 'text-ruby-accent'}`}>
                      IMEI DEL EQUIPO · {imeiLleno ? 'REGISTRADO ✓' : 'OBLIGATORIO'}
                    </p>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 text-xs font-bold">[ ]</span>
                        <input type="text" placeholder="IMEI 1" value={item.imei1 || ''} onChange={(e) => actualizarImei(item.cartItemId, e.target.value, item.imei2)} className={`w-full bg-ruby-bgLight dark:bg-ruby-bgDark border rounded-xl py-3 pl-10 pr-4 text-xs font-mono outline-none ${imeiLleno ? 'border-emerald-500/50 text-emerald-600 dark:text-emerald-500 focus:border-emerald-500' : 'border-ruby-accent/50 text-ruby-accent focus:border-ruby-accent'}`} />
                      </div>
                      <button onClick={() => setScannerAbierto({ idItem: item.cartItemId, campo: 'imei1' })} className="bg-ruby-bgLight dark:bg-ruby-bgDark border border-ruby-textLight/10 dark:border-white/10 rounded-xl w-14 flex items-center justify-center opacity-70"><ScanLine size={20} /></button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-ruby-panelLight dark:bg-ruby-panelDark border border-ruby-textLight/10 dark:border-white/5 rounded-2xl p-5 mb-6 shadow-sm transition-colors">
          <div className="flex justify-between items-center">
            <span className="font-black text-xl tracking-wide">TOTAL</span>
            <span className="font-mono font-black text-2xl text-ruby-priceLight dark:text-ruby-priceDark">Bs. {totalVenta.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <button onClick={() => setMetodoPago('efectivo')} className={`py-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${metodoPago === 'efectivo' ? 'bg-ruby-accent/10 border-ruby-accent text-ruby-accent' : 'bg-ruby-panelLight dark:bg-ruby-panelDark border-ruby-textLight/10 dark:border-white/10 opacity-70'}`}><Banknote size={20} /> Efectivo</button>
          <button onClick={() => setMetodoPago('qr')} className={`py-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${metodoPago === 'qr' ? 'bg-ruby-accent/10 border-ruby-accent text-ruby-accent' : 'bg-ruby-panelLight dark:bg-ruby-panelDark border-ruby-textLight/10 dark:border-white/10 opacity-70'}`}><QrCode size={20} /> QR</button>
        </div>
      </div>

      <div className="absolute bottom-0 w-full bg-ruby-bgLight dark:bg-ruby-bgDark border-t border-ruby-textLight/10 dark:border-white/5 p-5 pb-8 z-40 transition-colors">
        {faltanImeis ? (
          <button disabled className="w-full bg-ruby-panelLight dark:bg-ruby-panelDark border border-ruby-accent/30 text-ruby-accent/50 py-4 rounded-2xl font-bold text-lg flex justify-center items-center gap-2 cursor-not-allowed"><AlertTriangle size={20} /> Faltan IMEIs</button>
        ) : (
          <button disabled={!metodoPago || procesandoVenta} onClick={confirmarVenta} className="w-full bg-ruby-accent text-white py-4 rounded-2xl font-black text-lg shadow-[0_10px_30px_rgba(239,68,68,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none">
            {procesandoVenta ? 'Procesando...' : `Confirmar Venta — Bs. ${totalVenta.toFixed(2)}`}
          </button>
        )}
      </div>

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
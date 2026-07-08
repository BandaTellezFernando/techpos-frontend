import { useState, useEffect, useCallback } from 'react';
import { Smartphone, Headphones, Search, Plus, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';

interface ProductoAPI {
  _id: string;
  nombre: string;
  marca: string;
  tipoProducto: string;
  ram?: string;
  almacenamiento?: string;
  stock: number;
  precioBase: number;
  monedaBase: string;
  precioFinalBob: number;
}

export default function Inventario() {
  const [productos, setProductos] = useState<ProductoAPI[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [toast, setToast] = useState<{mensaje: string, tipo: 'exito' | 'error'} | null>(null);

  const [tipoProdModal, setTipoProdModal] = useState<'Celular' | 'Accesorio'>('Celular');
  const [formData, setFormData] = useState({
    nombre: '', marca: '', categoria: 'General', precioBase: '', monedaBase: 'USD',
    stock: '', stockMinimo: '2', ram: '', almacenamiento: '', color: 'Negro', compatibilidad: 'Universal', tipoAccesorio: 'Funda'
  });

  const mostrarNotificacion = (mensaje: string, tipo: 'exito' | 'error') => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 4000);
  };

  const cargarInventario = useCallback(async () => {
    try {
      setCargando(true);
      const response = await api.get('/productos');
      setProductos(response.data.productos);
    } catch (error) {
      console.error(error); // Evita el error de "error is defined but never used"
      mostrarNotificacion('Error al cargar inventario', 'error');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => { cargarInventario(); }, 0);
  }, [cargarInventario]);

  const guardarProducto = async () => {
    try {
      // Reemplazamos el 'any' con Record para decirle a TypeScript que 
      // este objeto contendrá propiedades con valores string o number
      const payload: Record<string, string | number> = {
        nombre: formData.nombre,
        marca: formData.marca,
        categoria: formData.categoria,
        precioBase: Number(formData.precioBase),
        monedaBase: formData.monedaBase,
        stock: Number(formData.stock),
        stockMinimo: Number(formData.stockMinimo),
        tipoProducto: tipoProdModal
      };

      if (tipoProdModal === 'Celular') {
        payload.ram = formData.ram;
        payload.almacenamiento = formData.almacenamiento;
        payload.color = formData.color;
      } else {
        payload.compatibilidad = formData.compatibilidad;
        payload.tipoAccesorio = formData.tipoAccesorio;
      }

      await api.post('/productos', payload);
      mostrarNotificacion('Producto guardado con éxito', 'exito');
      setModalAbierto(false);
      cargarInventario();
      
      setFormData({
        nombre: '', marca: '', categoria: 'General', precioBase: '', monedaBase: 'USD',
        stock: '', stockMinimo: '2', ram: '', almacenamiento: '', color: 'Negro', compatibilidad: 'Universal', tipoAccesorio: 'Funda'
      });
    } catch (error) {
      const err = error as { response?: { data?: { mensaje?: string } } };
      mostrarNotificacion(err.response?.data?.mensaje || 'Error al guardar', 'error');
    }
  };

  const totalCelulares = productos.filter(p => p.tipoProducto === 'Celular').length;
  const totalAccesorios = productos.filter(p => p.tipoProducto === 'Accesorio').length;

  return (
    <div className="flex flex-col h-full animate-fade-in p-8 w-full relative overflow-hidden">
      
      {toast && (
        <div className={`absolute top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-xl shadow-2xl font-bold text-sm animate-fade-in ${toast.tipo === 'error' ? 'bg-ruby-accent text-white' : 'bg-emerald-500 text-white'}`}>
          {toast.tipo === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          {toast.mensaje}
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold">Inventario</h2>
          <p className="opacity-70 mt-1">{productos.length} productos registrados {cargando && '(Cargando...)'}</p>
        </div>
        <button onClick={() => setModalAbierto(true)} className="bg-ruby-accent text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-ruby-accent/20">
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex bg-ruby-panelLight dark:bg-ruby-panelDark border border-ruby-textLight/10 dark:border-ruby-textDark/10 rounded-xl p-1">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold bg-ruby-textLight/5 dark:bg-white/5 border border-ruby-textLight/10 dark:border-ruby-textDark/10">
            <Smartphone size={18} /> Celulares <span className="text-xs bg-ruby-textLight/10 dark:bg-ruby-textDark/10 px-2 py-0.5 rounded opacity-70">{totalCelulares}</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold opacity-60">
            <Headphones size={18} /> Accesorios <span className="text-xs px-2 py-0.5 rounded border border-transparent">{totalAccesorios}</span>
          </button>
        </div>
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
          <input type="text" placeholder="Buscar producto..." className="w-full bg-ruby-panelLight dark:bg-ruby-panelDark border border-ruby-textLight/10 dark:border-ruby-textDark/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-ruby-accent transition-colors shadow-sm" />
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-ruby-panelLight dark:bg-ruby-panelDark border border-ruby-textLight/10 dark:border-ruby-textDark/10 rounded-2xl shadow-sm relative">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-ruby-textLight/10 dark:border-ruby-textDark/10 text-xs opacity-60 tracking-widest uppercase sticky top-0 bg-ruby-panelLight dark:bg-ruby-panelDark z-10">
              <th className="p-5 font-bold">Nombre</th>
              <th className="p-5 font-bold">Marca</th>
              <th className="p-5 font-bold">Specs</th>
              <th className="p-5 font-bold text-center">Stock</th>
              <th className="p-5 font-bold">Precio Base</th>
              <th className="p-5 font-bold text-right">Precio Final (Bs)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ruby-textLight/5 dark:divide-ruby-textDark/5">
            {productos.map(p => (
              <tr key={p._id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-black/5 dark:bg-white/5 flex items-center justify-center opacity-70">
                      {p.tipoProducto === 'Celular' ? <Smartphone size={16} /> : <Headphones size={16} />}
                    </div>
                    <p className="font-bold">{p.nombre}</p>
                  </div>
                </td>
                <td className="p-5 opacity-70">{p.marca}</td>
                <td className="p-5 font-mono text-xs opacity-70">
                  {p.tipoProducto === 'Celular' ? `${p.ram} / ${p.almacenamiento}` : 'Accesorio'}
                </td>
                <td className="p-5 text-center font-bold">
                  <span className={`px-3 py-1 rounded-full text-xs ${p.stock <= 2 ? 'bg-ruby-accent/10 text-ruby-accent border border-ruby-accent/20' : 'bg-black/5 dark:bg-white/5'}`}>{p.stock}</span>
                </td>
                <td className="p-5 font-mono text-sm">{p.precioBase} {p.monedaBase}</td>
                <td className="p-5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-500">Bs. {p.precioFinalBob.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-ruby-bgLight dark:bg-ruby-bgDark w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-ruby-textLight/10 dark:border-white/10 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-ruby-textLight/10 dark:border-white/5 bg-ruby-panelLight dark:bg-ruby-panelDark shrink-0">
              <h3 className="font-bold text-xl">Crear Producto</h3>
              <button onClick={() => setModalAbierto(false)} className="opacity-50 hover:opacity-100"><X size={24} /></button>
            </div>
            
            <div className="overflow-y-auto p-6 space-y-4">
              <div className="flex gap-2 mb-2">
                <button onClick={() => setTipoProdModal('Celular')} className={`flex-1 py-2 rounded-lg font-bold border transition-colors ${tipoProdModal === 'Celular' ? 'bg-ruby-accent/10 border-ruby-accent text-ruby-accent' : 'opacity-50'}`}>Celular</button>
                <button onClick={() => setTipoProdModal('Accesorio')} className={`flex-1 py-2 rounded-lg font-bold border transition-colors ${tipoProdModal === 'Accesorio' ? 'bg-ruby-accent/10 border-ruby-accent text-ruby-accent' : 'opacity-50'}`}>Accesorio</button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold opacity-50 uppercase block mb-1">Nombre</label>
                  <input type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full bg-ruby-panelLight dark:bg-black/20 border border-ruby-textLight/10 dark:border-white/10 rounded-xl py-2 px-3 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold opacity-50 uppercase block mb-1">Marca</label>
                  <input type="text" value={formData.marca} onChange={e => setFormData({...formData, marca: e.target.value})} className="w-full bg-ruby-panelLight dark:bg-black/20 border border-ruby-textLight/10 dark:border-white/10 rounded-xl py-2 px-3 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold opacity-50 uppercase block mb-1">Precio Base</label>
                  <input type="number" value={formData.precioBase} onChange={e => setFormData({...formData, precioBase: e.target.value})} className="w-full bg-ruby-panelLight dark:bg-black/20 border border-ruby-textLight/10 dark:border-white/10 rounded-xl py-2 px-3 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold opacity-50 uppercase block mb-1">Moneda</label>
                  <select value={formData.monedaBase} onChange={e => setFormData({...formData, monedaBase: e.target.value})} className="w-full bg-ruby-panelLight dark:bg-black/20 border border-ruby-textLight/10 dark:border-white/10 rounded-xl py-2 px-3 outline-none">
                    <option value="USD">Dólares (USD)</option>
                    <option value="BOB">Bolivianos (BOB)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold opacity-50 uppercase block mb-1">Stock Inicial</label>
                  <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-ruby-panelLight dark:bg-black/20 border border-ruby-textLight/10 dark:border-white/10 rounded-xl py-2 px-3 outline-none" />
                </div>
              </div>

              {tipoProdModal === 'Celular' && (
                <div className="grid grid-cols-2 gap-4 mt-4 p-4 border border-ruby-textLight/10 dark:border-white/5 rounded-xl bg-black/5 dark:bg-white/5">
                  <div>
                    <label className="text-[10px] font-bold opacity-50 uppercase block mb-1">Memoria RAM</label>
                    <input type="text" placeholder="Ej. 8 GB" value={formData.ram} onChange={e => setFormData({...formData, ram: e.target.value})} className="w-full bg-ruby-panelLight dark:bg-black/20 border border-ruby-textLight/10 dark:border-white/10 rounded-xl py-2 px-3 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold opacity-50 uppercase block mb-1">Almacenamiento</label>
                    <input type="text" placeholder="Ej. 256 GB" value={formData.almacenamiento} onChange={e => setFormData({...formData, almacenamiento: e.target.value})} className="w-full bg-ruby-panelLight dark:bg-black/20 border border-ruby-textLight/10 dark:border-white/10 rounded-xl py-2 px-3 outline-none" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 p-6 border-t border-ruby-textLight/10 dark:border-white/5 bg-ruby-panelLight dark:bg-ruby-panelDark shrink-0">
              <button onClick={() => setModalAbierto(false)} className="flex-1 py-3 rounded-xl font-bold border border-ruby-textLight/20 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5">Cancelar</button>
              <button onClick={guardarProducto} className="flex-1 py-3 rounded-xl font-bold bg-ruby-accent text-white hover:opacity-90">Guardar Producto</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
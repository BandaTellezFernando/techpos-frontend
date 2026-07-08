import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, CircleDollarSign, RefreshCw, Trophy, X } from 'lucide-react';
import api from '../../api/axios';

export default function Dashboard() {
  const [dolar, setDolar] = useState<number | null>(null);
  
  // Estados para el Modal del Dólar
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoDolar, setNuevoDolar] = useState('');
  const [errorModal, setErrorModal] = useState('');

  const cargarDolar = async () => {
    try {
      const res = await api.get('/configuracion');
      setDolar(res.data.configuracion.tipoCambioDolar);
    } catch (error) {
      console.error("Error al cargar configuración", error);
    }
  };

  useEffect(() => {
    setTimeout(() => { cargarDolar(); }, 0);
  }, []);

  const abrirModalDolar = () => {
    setNuevoDolar(dolar ? dolar.toString() : '');
    setErrorModal('');
    setModalAbierto(true);
  };

  const guardarNuevoDolar = async () => {
    const valorNum = parseFloat(nuevoDolar);
    if (isNaN(valorNum) || valorNum <= 0) {
      setErrorModal('Ingresa un valor numérico válido mayor a 0.');
      return;
    }

    try {
      await api.put('/configuracion/dolar', { nuevoValor: valorNum });
      setDolar(valorNum);
      setModalAbierto(false);
    } catch (error) {
      const err = error as { response?: { data?: { mensaje?: string } } };
      setErrorModal(err.response?.data?.mensaje || 'Error al actualizar el servidor.');
    }
  };

  const hoy = new Date().toLocaleDateString('es-BO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col gap-6 animate-fade-in w-full h-full overflow-y-auto p-8 relative">
      
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="opacity-70 mt-1 capitalize">{hoy}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-ruby-panelLight dark:bg-ruby-panelDark p-6 rounded-xl border border-ruby-textLight/10 dark:border-ruby-textDark/10 shadow-sm opacity-50">
          <div className="flex justify-between items-start mb-4"><TrendingUp className="text-emerald-500" size={24} /></div>
          <h3 className="text-xs font-bold opacity-60 tracking-widest uppercase">Ventas de Hoy</h3>
          <p className="text-2xl font-black font-mono mt-1">Próximamente</p>
        </div>

        <div className="bg-ruby-panelLight dark:bg-ruby-panelDark p-6 rounded-xl border border-ruby-textLight/10 dark:border-ruby-textDark/10 shadow-sm opacity-50">
          <div className="flex justify-between items-start mb-4"><ShoppingBag className="text-blue-500" size={24} /></div>
          <h3 className="text-xs font-bold opacity-60 tracking-widest uppercase">Transacciones</h3>
          <p className="text-2xl font-black font-mono mt-1">Próximamente</p>
        </div>

        <div className="bg-ruby-panelLight dark:bg-ruby-panelDark p-6 rounded-xl border border-ruby-textLight/10 dark:border-ruby-textDark/10 shadow-sm flex flex-col justify-between border-b-4 border-b-ruby-accent">
          <div>
            <div className="flex justify-between items-start mb-4">
              <CircleDollarSign className="text-amber-500" size={24} />
              <span className="opacity-50 text-xs font-bold bg-black/5 dark:bg-white/5 px-2 py-1 rounded">T/C MONGODB</span>
            </div>
            <h3 className="text-xs font-bold opacity-60 tracking-widest uppercase">Dólar Actual</h3>
            <p className="text-4xl font-black font-mono mt-1 text-ruby-priceLight dark:text-ruby-priceDark">
              Bs. {dolar !== null ? dolar : '...'}
            </p>
          </div>
          <button onClick={abrirModalDolar} className="mt-4 flex items-center gap-2 text-sm border border-ruby-textLight/20 dark:border-ruby-textDark/20 rounded-lg px-4 py-2 w-max hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-semibold">
            <RefreshCw size={16} /> Editar
          </button>
        </div>
      </div>

      <div className="bg-ruby-panelLight dark:bg-ruby-panelDark rounded-xl border border-ruby-textLight/10 dark:border-ruby-textDark/10 shadow-sm p-6 mt-2 opacity-50">
        <h3 className="text-lg font-bold mb-6">Ranking — Productos Más Vendidos (Próximamente)</h3>
        <div className="flex flex-col items-center py-10">
          <Trophy size={48} className="opacity-20 mb-4" />
          <p className="font-medium opacity-60">Aquí verás los productos reales de MongoDB</p>
        </div>
      </div>

      {/* MODAL DEL DÓLAR */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-ruby-bgLight dark:bg-ruby-bgDark w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-ruby-textLight/10 dark:border-white/10">
            <div className="flex justify-between items-center p-6 border-b border-ruby-textLight/10 dark:border-white/5 bg-ruby-panelLight dark:bg-ruby-panelDark">
              <h3 className="font-bold text-lg">Actualizar Dólar</h3>
              <button onClick={() => setModalAbierto(false)} className="opacity-50 hover:opacity-100"><X size={24} /></button>
            </div>
            <div className="p-6">
              <label className="text-[10px] font-bold opacity-50 tracking-widest uppercase mb-2 block">Nuevo Tipo de Cambio (Bs.)</label>
              <input 
                type="number" step="0.01" autoFocus
                value={nuevoDolar} onChange={(e) => setNuevoDolar(e.target.value)}
                className="w-full bg-ruby-panelLight dark:bg-[#261C1D] border border-ruby-textLight/20 dark:border-white/10 rounded-xl py-3 px-4 font-mono text-xl outline-none focus:border-ruby-accent transition-colors" 
              />
              {errorModal && <p className="text-ruby-accent text-xs font-bold mt-3">{errorModal}</p>}
            </div>
            <div className="flex gap-3 p-6 border-t border-ruby-textLight/10 dark:border-white/5 bg-ruby-panelLight dark:bg-ruby-panelDark">
              <button onClick={() => setModalAbierto(false)} className="flex-1 py-3 rounded-xl font-bold border border-ruby-textLight/20 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Cancelar</button>
              <button onClick={guardarNuevoDolar} className="flex-1 py-3 rounded-xl font-bold bg-ruby-accent text-white hover:opacity-90 transition-opacity">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
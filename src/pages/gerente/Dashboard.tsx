import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, ShoppingBag, CircleDollarSign, RefreshCw, Trophy, X, Package } from 'lucide-react';
import api from '../../api/axios';

interface RankingItem {
  _id: string;
  nombre: string;
  cantidadTotal: number;
  ingresoTotal: number;
}

export default function Dashboard() {
  const [dolar, setDolar] = useState<number | null>(null);
  const [ventasHoy, setVentasHoy] = useState<number>(0);
  const [transaccionesHoy, setTransaccionesHoy] = useState<number>(0);
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [cargando, setCargando] = useState(true);
  
  // Estados para el Modal del Dólar
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoDolar, setNuevoDolar] = useState('');
  const [errorModal, setErrorModal] = useState('');

  const cargarDatosDashboard = useCallback(async () => {
    try {
      setCargando(true);
      
      // 1. Cargar el Dólar
      const resConfig = await api.get('/configuracion');
      setDolar(resConfig.data.configuracion.tipoCambioDolar);

      // 2. Cargar las Ventas de Hoy (Llamamos a cierre-caja sin pasar fechas, por defecto toma el día actual)
      const resCierre = await api.get('/ventas/cierre-caja');
      setVentasHoy(resCierre.data.granTotalBs);
      setTransaccionesHoy(resCierre.data.totalTransacciones);

      // 3. Cargar el Top 5 de Productos
      const resRanking = await api.get('/ventas/ranking');
      setRanking(resRanking.data.ranking);

    } catch (error) {
      console.error("Error al cargar los datos del dashboard", error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => { cargarDatosDashboard(); }, 0);
  }, [cargarDatosDashboard]);

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
      
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="opacity-70 mt-1 capitalize">{hoy}</p>
        </div>
        <div className="flex items-center gap-2 bg-ruby-panelLight dark:bg-ruby-panelDark px-4 py-1.5 rounded-full border border-ruby-textLight/10 dark:border-ruby-textDark/10 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-sm font-semibold opacity-80">
            {cargando ? 'Sincronizando...' : 'Sistema en línea'}
          </span>
        </div>
      </div>

      {/* WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-ruby-panelLight dark:bg-ruby-panelDark p-6 rounded-xl border border-ruby-textLight/10 dark:border-ruby-textDark/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <TrendingUp className="text-emerald-500" size={24} />
              <span className="opacity-50 text-xs font-bold bg-black/5 dark:bg-white/5 px-2 py-1 rounded">HOY</span>
            </div>
            <h3 className="text-xs font-bold opacity-60 tracking-widest uppercase">Ingresos Brutos</h3>
            <p className="text-3xl font-black font-mono mt-1 text-emerald-600 dark:text-emerald-500">
              Bs. {ventasHoy.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-ruby-panelLight dark:bg-ruby-panelDark p-6 rounded-xl border border-ruby-textLight/10 dark:border-ruby-textDark/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <ShoppingBag className="text-blue-500" size={24} />
              <span className="opacity-50 text-xs font-bold bg-black/5 dark:bg-white/5 px-2 py-1 rounded">HOY</span>
            </div>
            <h3 className="text-xs font-bold opacity-60 tracking-widest uppercase">Transacciones</h3>
            <p className="text-3xl font-black font-mono mt-1 text-blue-600 dark:text-blue-500">
              {transaccionesHoy}
            </p>
          </div>
        </div>

        <div className="bg-ruby-panelLight dark:bg-ruby-panelDark p-6 rounded-xl border border-ruby-textLight/10 dark:border-ruby-textDark/10 shadow-sm flex flex-col justify-between border-b-4 border-b-ruby-accent">
          <div>
            <div className="flex justify-between items-start mb-4">
              <CircleDollarSign className="text-amber-500" size={24} />
              <span className="opacity-50 text-xs font-bold bg-black/5 dark:bg-white/5 px-2 py-1 rounded">GLOBAL</span>
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

      {/* RANKING */}
      <div className="bg-ruby-panelLight dark:bg-ruby-panelDark rounded-xl border border-ruby-textLight/10 dark:border-ruby-textDark/10 shadow-sm p-6 mt-2">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="text-amber-500" size={24} />
          <h3 className="text-lg font-bold">Top 5 Productos Más Vendidos</h3>
        </div>
        
        {ranking.length === 0 && !cargando ? (
          <div className="flex flex-col items-center py-10 opacity-50">
            <Package size={48} className="mb-4 opacity-40" />
            <p className="font-medium">No hay ventas registradas todavía.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ranking.map((item, index) => (
              <div key={item._id} className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-ruby-textLight/5 dark:border-white/5 transition-colors hover:border-ruby-accent/30">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${index === 0 ? 'bg-amber-500 text-white' : index === 1 ? 'bg-gray-400 text-white' : index === 2 ? 'bg-amber-700 text-white' : 'bg-ruby-textLight/10 dark:bg-white/10'}`}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-base leading-none">{item.nombre}</h4>
                    <p className="text-xs opacity-60 mt-1">{item.cantidadTotal} unidades vendidas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] opacity-60 tracking-widest uppercase font-bold mb-1">Ingresos</p>
                  <p className="font-mono font-bold text-ruby-priceLight dark:text-ruby-priceDark">Bs. {item.ingresoTotal.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
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
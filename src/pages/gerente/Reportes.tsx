//src/pages/gerente/Reportes.tsx
import { useState, useEffect, useCallback } from 'react';
import { Calendar, Filter, FileDown, Banknote, QrCode, CreditCard, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';

interface ReporteItem {
  metodo: string;
  recaudadoBs: number;
  transacciones: number;
}

export default function Reportes() {
  const hoyStr = new Date().toISOString().split('T')[0];
  
  const [fechaInicio, setFechaInicio] = useState(hoyStr);
  const [fechaFin, setFechaFin] = useState(hoyStr);
  const [cargando, setCargando] = useState(false);
  
  const [resumen, setResumen] = useState<ReporteItem[]>([]);
  const [granTotal, setGranTotal] = useState(0);

  const cargarReporte = useCallback(async () => {
    try {
      setCargando(true);
      const res = await api.get(`/ventas/cierre-caja?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
      setResumen(res.data.resumenCobros);
      setGranTotal(res.data.granTotalBs);
    } catch (error) {
      console.error('Error al cargar reporte:', error);
      alert('Error al consultar el cierre de caja');
    } finally {
      setCargando(false);
    }
  }, [fechaInicio, fechaFin]);

  useEffect(() => {
    setTimeout(() => { cargarReporte(); }, 0);
  }, [cargarReporte]);

  // Funciones de ayuda para extraer datos por método
  const getDatoMetodo = (metodo: string) => resumen.find(r => r.metodo === metodo) || { recaudadoBs: 0, transacciones: 0 };
  const efectivo = getDatoMetodo('Efectivo');
  const qr = getDatoMetodo('QR');
  const tarjeta = getDatoMetodo('Tarjeta');

  return (
    <div className="flex flex-col h-full animate-fade-in p-8 overflow-y-auto w-full">
      
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Reportes · Cierre de Caja</h2>
        <p className="opacity-70 mt-1">Resumen por método de pago {cargando && '(Actualizando...)'}</p>
      </div>

      <div className="flex gap-4 mb-6 items-center">
        <div className="flex items-center gap-4 bg-ruby-panelLight dark:bg-ruby-panelDark p-2 rounded-xl border border-ruby-textLight/10 dark:border-ruby-textDark/10 shadow-sm">
          <div className="flex flex-col px-2">
            <span className="text-[10px] opacity-60 font-bold tracking-widest uppercase mb-1">Desde</span>
            <div className="flex items-center gap-2">
              <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="bg-transparent outline-none text-sm font-bold w-[120px]" />
            </div>
          </div>
          <div className="w-px h-8 bg-ruby-textLight/10 dark:bg-ruby-textDark/10"></div>
          <div className="flex flex-col px-2">
            <span className="text-[10px] opacity-60 font-bold tracking-widest uppercase mb-1">Hasta</span>
            <div className="flex items-center gap-2">
              <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="bg-transparent outline-none text-sm font-bold w-[120px]" />
            </div>
          </div>
        </div>
        <button onClick={cargarReporte} className="bg-ruby-accent text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm">
          <Filter size={18} /> Filtrar
        </button>
        <button className="border border-ruby-textLight/20 dark:border-ruby-textDark/20 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors opacity-50 cursor-not-allowed">
          <FileDown size={18} /> Exportar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20 p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <Banknote className="text-emerald-500" size={28} />
            <span className="text-xs font-bold opacity-50">{efectivo.transacciones} transacciones</span>
          </div>
          <div>
            <p className="text-xs font-bold opacity-60 tracking-widest uppercase mb-1">Efectivo</p>
            <p className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-500">Bs. {efectivo.recaudadoBs.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-500/20 p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <QrCode className="text-blue-500" size={28} />
            <span className="text-xs font-bold opacity-50">{qr.transacciones} transacciones</span>
          </div>
          <div>
            <p className="text-xs font-bold opacity-60 tracking-widest uppercase mb-1">QR</p>
            <p className="text-3xl font-black font-mono text-blue-600 dark:text-blue-500">Bs. {qr.recaudadoBs.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-500/20 p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <CreditCard className="text-purple-500" size={28} />
            <span className="text-xs font-bold opacity-50">{tarjeta.transacciones} transacciones</span>
          </div>
          <div>
            <p className="text-xs font-bold opacity-60 tracking-widest uppercase mb-1">Tarjeta</p>
            <p className="text-3xl font-black font-mono text-purple-600 dark:text-purple-500">Bs. {tarjeta.recaudadoBs.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-ruby-accent/5 border border-ruby-accent/20 p-6 rounded-2xl flex justify-between items-center mb-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-ruby-accent/20 text-ruby-accent flex items-center justify-center border border-ruby-accent/30">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="font-bold text-lg">Total Recaudado</p>
            <p className="text-xs opacity-60 font-mono">{fechaInicio} → {fechaFin}</p>
          </div>
        </div>
        <p className="text-4xl font-black font-mono text-ruby-priceLight dark:text-ruby-priceDark">Bs. {granTotal.toFixed(2)}</p>
      </div>

      <div className="bg-ruby-panelLight dark:bg-ruby-panelDark border border-ruby-textLight/10 dark:border-ruby-textDark/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center border-dashed opacity-50">
        <Calendar size={48} className="mb-4 opacity-50" />
        <h3 className="font-bold text-lg">Historial Detallado Próximamente</h3>
        <p className="text-sm mt-2 max-w-md">El detalle de cada venta individual requiere una nueva ruta en el backend. Por ahora, disfruta de los resúmenes automáticos y filtrado por fechas.</p>
      </div>
    </div>
  );
}
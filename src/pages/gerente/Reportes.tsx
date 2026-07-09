import { useState, useEffect, useCallback } from 'react';
// ¡AQUÍ ESTÁ LA CORRECCIÓN! Ya no importamos 'Calendar'
import { Filter, FileDown, Banknote, QrCode, CreditCard, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';
import { generarReportePDF } from '../../utils/pdfGenerator'; // <-- IMPORTAMOS EL GENERADOR PDF

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

  const getDatoMetodo = (metodo: string) => resumen.find(r => r.metodo === metodo) || { recaudadoBs: 0, transacciones: 0 };
  const efectivo = getDatoMetodo('Efectivo');
  const qr = getDatoMetodo('QR');
  const tarjeta = getDatoMetodo('Tarjeta');

  return (
    <div className="flex flex-col h-full animate-fade-in p-4 md:p-8 overflow-y-auto w-full">
      
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">Reportes · Cierre de Caja</h2>
        <p className="opacity-70 mt-1 text-sm md:text-base">Resumen por método de pago {cargando && '(Actualizando...)'}</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-4 mb-6 xl:items-center">
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-ruby-panelLight dark:bg-ruby-panelDark p-3 rounded-xl border border-ruby-textLight/10 dark:border-ruby-textDark/10 shadow-sm w-full xl:w-auto">
          <div className="flex flex-col px-2 w-full">
            <span className="text-[10px] opacity-60 font-bold tracking-widest uppercase mb-1">Desde</span>
            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="bg-transparent outline-none text-sm font-bold w-full sm:w-[120px]" />
          </div>
          <div className="hidden sm:block w-px h-8 bg-ruby-textLight/10 dark:bg-ruby-textDark/10"></div>
          <div className="sm:hidden w-full h-px bg-ruby-textLight/10 dark:bg-ruby-textDark/10 my-1"></div>
          <div className="flex flex-col px-2 w-full">
            <span className="text-[10px] opacity-60 font-bold tracking-widest uppercase mb-1">Hasta</span>
            <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="bg-transparent outline-none text-sm font-bold w-full sm:w-[120px]" />
          </div>
        </div>

        <div className="flex gap-2 w-full xl:w-auto">
          <button onClick={cargarReporte} className="flex-1 xl:flex-none justify-center bg-ruby-accent text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm">
            <Filter size={18} /> Filtrar
          </button>
          {/* <-- BOTÓN EXPORTAR CONECTADO AL PDF --> */}
          <button 
            onClick={() => generarReportePDF(fechaInicio, fechaFin, resumen, granTotal)}
            disabled={resumen.length === 0}
            className="flex-1 xl:flex-none justify-center border border-ruby-textLight/20 dark:border-ruby-textDark/20 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileDown size={18} /> Exportar
          </button>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20 p-5 md:p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <Banknote className="text-emerald-500" size={28} />
            <span className="text-xs font-bold opacity-50">{efectivo.transacciones} transacciones</span>
          </div>
          <div>
            <p className="text-xs font-bold opacity-60 tracking-widest uppercase mb-1">Efectivo</p>
            <p className="text-2xl md:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-500">Bs. {efectivo.recaudadoBs.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-500/20 p-5 md:p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <QrCode className="text-blue-500" size={28} />
            <span className="text-xs font-bold opacity-50">{qr.transacciones} transacciones</span>
          </div>
          <div>
            <p className="text-xs font-bold opacity-60 tracking-widest uppercase mb-1">QR</p>
            <p className="text-2xl md:text-3xl font-black font-mono text-blue-600 dark:text-blue-500">Bs. {qr.recaudadoBs.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-500/20 p-5 md:p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <CreditCard className="text-purple-500" size={28} />
            <span className="text-xs font-bold opacity-50">{tarjeta.transacciones} transacciones</span>
          </div>
          <div>
            <p className="text-xs font-bold opacity-60 tracking-widest uppercase mb-1">Tarjeta</p>
            <p className="text-2xl md:text-3xl font-black font-mono text-purple-600 dark:text-purple-500">Bs. {tarjeta.recaudadoBs.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-ruby-accent/5 border border-ruby-accent/20 p-5 md:p-6 rounded-2xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-ruby-accent/20 text-ruby-accent flex items-center justify-center border border-ruby-accent/30 shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="font-bold text-lg">Total Recaudado</p>
            <p className="text-xs opacity-60 font-mono">{fechaInicio} → {fechaFin}</p>
          </div>
        </div>
        <p className="text-3xl md:text-4xl font-black font-mono text-ruby-priceLight dark:text-ruby-priceDark">Bs. {granTotal.toFixed(2)}</p>
      </div>
    </div>
  );
}
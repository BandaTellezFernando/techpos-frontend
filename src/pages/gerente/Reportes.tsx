//src/pages/gerente/Reportes.tsx
import { Calendar, Filter, FileDown, Banknote, QrCode, CheckCircle2 } from 'lucide-react';

export default function Reportes() {
  return (
    <div className="flex flex-col h-full animate-fade-in p-8 overflow-y-auto w-full">
      
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Reportes · Cierre de Caja</h2>
        <p className="opacity-70 mt-1">Resumen por método de pago</p>
      </div>

      <div className="flex gap-4 mb-6 items-center">
        <div className="flex items-center gap-4 bg-ruby-panelLight dark:bg-ruby-panelDark p-2 rounded-xl border border-ruby-textLight/10 dark:border-ruby-textDark/10 shadow-sm">
          <div className="flex flex-col px-2">
            <span className="text-[10px] opacity-60 font-bold tracking-widest uppercase mb-1">Desde</span>
            <div className="flex items-center gap-2">
              <input type="text" defaultValue="01/07/2026" className="bg-transparent outline-none w-24 text-sm font-bold" />
              <Calendar size={16} className="opacity-50" />
            </div>
          </div>
          <div className="w-px h-8 bg-ruby-textLight/10 dark:bg-ruby-textDark/10"></div>
          <div className="flex flex-col px-2">
            <span className="text-[10px] opacity-60 font-bold tracking-widest uppercase mb-1">Hasta</span>
            <div className="flex items-center gap-2">
              <input type="text" defaultValue="05/07/2026" className="bg-transparent outline-none w-24 text-sm font-bold" />
              <Calendar size={16} className="opacity-50" />
            </div>
          </div>
        </div>
        <button className="bg-ruby-accent text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm">
          <Filter size={18} /> Filtrar
        </button>
        <button className="border border-ruby-textLight/20 dark:border-ruby-textDark/20 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <FileDown size={18} /> Exportar
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20 p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <Banknote className="text-emerald-500" size={28} />
            <span className="text-xs font-bold opacity-50">8 transacciones</span>
          </div>
          <div>
            <p className="text-xs font-bold opacity-60 tracking-widest uppercase mb-1">Efectivo</p>
            <p className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-500">Bs. 4.830,12</p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-500/20 p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <QrCode className="text-blue-500" size={28} />
            <span className="text-xs font-bold opacity-50">9 transacciones</span>
          </div>
          <div>
            <p className="text-xs font-bold opacity-60 tracking-widest uppercase mb-1">QR</p>
            <p className="text-3xl font-black font-mono text-blue-600 dark:text-blue-500">Bs. 7.418,43</p>
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
            <p className="text-xs opacity-60 font-mono">2026-07-01 → 2026-07-05</p>
          </div>
        </div>
        <p className="text-4xl font-black font-mono text-ruby-priceLight dark:text-ruby-priceDark">Bs. 12.248,55</p>
      </div>

      <div className="bg-ruby-panelLight dark:bg-ruby-panelDark border border-ruby-textLight/10 dark:border-ruby-textDark/10 rounded-2xl overflow-hidden flex-1 shadow-sm">
        <div className="p-5 border-b border-ruby-textLight/10 dark:border-ruby-textDark/10">
          <h3 className="font-bold text-lg">Registro de Ventas</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs opacity-60 tracking-widest uppercase">
              <th className="p-4 font-bold">ID</th>
              <th className="p-4 font-bold">Hora</th>
              <th className="p-4 font-bold">Empleado</th>
              <th className="p-4 font-bold">Método</th>
              <th className="p-4 font-bold text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ruby-textLight/5 dark:divide-ruby-textDark/5">
            <tr className="hover:bg-black/5 dark:hover:bg-white/5">
              <td className="p-4 font-mono text-sm opacity-70">V-001</td>
              <td className="p-4 font-mono text-sm">09:14</td>
              <td className="p-4 font-bold">Ana Quispe</td>
              <td className="p-4"><span className="text-[10px] font-bold bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-500 px-2 py-1 rounded border border-blue-500/20">Tarjeta</span></td>
              <td className="p-4 text-right font-mono font-bold">Bs. 7.659,03</td>
            </tr>
            <tr className="hover:bg-black/5 dark:hover:bg-white/5">
              <td className="p-4 font-mono text-sm opacity-70">V-002</td>
              <td className="p-4 font-mono text-sm">10:32</td>
              <td className="p-4 font-bold">Carlos Mendoza</td>
              <td className="p-4"><span className="text-[10px] font-bold bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-500 px-2 py-1 rounded border border-blue-500/20">QR</span></td>
              <td className="p-4 text-right font-mono font-bold">Bs. 5.567,43</td>
            </tr>
            <tr className="hover:bg-black/5 dark:hover:bg-white/5">
              <td className="p-4 font-mono text-sm opacity-70">V-003</td>
              <td className="p-4 font-mono text-sm">11:08</td>
              <td className="p-4 font-bold">Luis Torrico</td>
              <td className="p-4"><span className="text-[10px] font-bold bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-500 px-2 py-1 rounded border border-emerald-500/20">Efectivo</span></td>
              <td className="p-4 text-right font-mono font-bold">Bs. 1.038,53</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
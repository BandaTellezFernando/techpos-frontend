//src/pages/gerente/Dashboard.tsx
import { TrendingUp, ShoppingBag, CircleDollarSign, RefreshCw, Trophy, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in w-full h-full overflow-y-auto p-8">
      
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="opacity-70 mt-1">Martes, 7 de Julio de 2026</p>
        </div>
        <div className="flex items-center gap-2 bg-ruby-panelLight dark:bg-ruby-panelDark px-4 py-1.5 rounded-full border border-ruby-textLight/10 dark:border-ruby-textDark/10 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-ruby-accent animate-pulse"></span>
          <span className="text-sm font-semibold opacity-80">Sistema activo</span>
        </div>
      </div>

      {/* WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-ruby-panelLight dark:bg-ruby-panelDark p-6 rounded-xl border border-ruby-textLight/10 dark:border-ruby-textDark/10 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <TrendingUp className="text-emerald-500" size={24} />
            <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded">↗ +12%</span>
          </div>
          <h3 className="text-xs font-bold opacity-60 tracking-widest uppercase">Ventas de Hoy</h3>
          <p className="text-3xl font-black font-mono mt-1">Bs. 16.421,34</p>
          <p className="text-xs opacity-50 mt-1">↑ respecto a ayer</p>
        </div>

        <div className="bg-ruby-panelLight dark:bg-ruby-panelDark p-6 rounded-xl border border-ruby-textLight/10 dark:border-ruby-textDark/10 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <ShoppingBag className="text-blue-500" size={24} />
            <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded">↗ +3</span>
          </div>
          <h3 className="text-xs font-bold opacity-60 tracking-widest uppercase">Total Ventas Hoy</h3>
          <p className="text-3xl font-black font-mono mt-1">23</p>
          <p className="text-xs opacity-50 mt-1">transacciones</p>
        </div>

        <div className="bg-ruby-panelLight dark:bg-ruby-panelDark p-6 rounded-xl border border-ruby-textLight/10 dark:border-ruby-textDark/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <CircleDollarSign className="text-amber-500" size={24} />
              <span className="opacity-50 text-xs font-bold">T/C</span>
            </div>
            <h3 className="text-xs font-bold opacity-60 tracking-widest uppercase">Dólar Actual</h3>
            <p className="text-3xl font-black font-mono mt-1">Bs. 6.97</p>
          </div>
          <button className="mt-4 flex items-center gap-2 text-sm border border-ruby-textLight/20 dark:border-ruby-textDark/20 rounded-lg px-4 py-2 w-max hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-semibold">
            <RefreshCw size={16} /> Editar
          </button>
        </div>
      </div>

      {/* RANKING */}
      <div className="bg-ruby-panelLight dark:bg-ruby-panelDark rounded-xl border border-ruby-textLight/10 dark:border-ruby-textDark/10 shadow-sm p-6 mt-2">
        <h3 className="text-lg font-bold mb-6">Ranking — Productos Más Vendidos</h3>
        
        <div className="flex flex-col">
          <div className="flex justify-between items-center py-4 border-b border-ruby-textLight/5 dark:border-ruby-textDark/5">
            <div className="flex items-center gap-4">
              <Trophy size={28} className="text-amber-500" />
              <div>
                <p className="font-bold text-amber-500 dark:text-amber-400">iPhone 15 Pro</p>
                <p className="text-xs opacity-60">Apple</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">18 uds.</p>
              <p className="text-xs opacity-60 font-mono">Bs. 136.791,66</p>
            </div>
          </div>

          <div className="flex justify-between items-center py-4 border-b border-ruby-textLight/5 dark:border-ruby-textDark/5">
            <div className="flex items-center gap-4">
              <Trophy size={28} className="text-gray-400" />
              <div>
                <p className="font-bold">Samsung Galaxy S24</p>
                <p className="text-xs opacity-60">Samsung</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">14 uds.</p>
              <p className="text-xs opacity-60 font-mono">Bs. 77.944,02</p>
            </div>
          </div>

          <div className="flex justify-between items-center py-4 border-b border-ruby-textLight/5 dark:border-ruby-textDark/5">
            <div className="flex items-center gap-4">
              <Trophy size={28} className="text-orange-600 dark:text-orange-400" />
              <div>
                <p className="font-bold text-orange-600 dark:text-orange-400">Xiaomi Redmi Note 13</p>
                <p className="text-xs opacity-60">Xiaomi</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">11 uds.</p>
              <p className="text-xs opacity-60 font-mono">Bs. 42.073,03</p>
            </div>
          </div>

          <div className="flex justify-between items-center py-4 border-b border-ruby-textLight/5 dark:border-ruby-textDark/5">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold opacity-50 w-7 text-center">#4</span>
              <div>
                <p className="font-bold">Auriculares Galaxy Buds2</p>
                <p className="text-xs opacity-60">Samsung</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">9 uds.</p>
              <p className="text-xs opacity-60 font-mono">Bs. 9.346,59</p>
            </div>
          </div>

          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold opacity-50 w-7 text-center">#5</span>
              <div>
                <p className="font-bold">Motorola Edge 40</p>
                <p className="text-xs opacity-60">Motorola</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">7 uds.</p>
              <p className="text-xs opacity-60 font-mono">Bs. 12.950,00</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-ruby-textLight/5 dark:border-ruby-textDark/5 flex justify-between items-center">
          <button className="text-ruby-accent text-sm font-bold hover:underline flex items-center gap-1">
            Ver reporte completo <ChevronRight size={16} />
          </button>
        </div>
      </div>

    </div>
  );
}
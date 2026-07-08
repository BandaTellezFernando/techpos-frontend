//src/pages/gerente/Inventario.tsx
import { Smartphone, Headphones, Search, Plus } from 'lucide-react';

export default function Inventario() {
  return (
    <div className="flex flex-col h-full animate-fade-in p-8 w-full">
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold">Inventario</h2>
          <p className="opacity-70 mt-1">9 productos registrados</p>
        </div>
        <button className="bg-ruby-accent text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-ruby-accent/20">
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex bg-ruby-panelLight dark:bg-ruby-panelDark border border-ruby-textLight/10 dark:border-ruby-textDark/10 rounded-xl p-1">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold bg-ruby-textLight/5 dark:bg-white/5 border border-ruby-textLight/10 dark:border-ruby-textDark/10">
            <Smartphone size={18} /> Smartphones <span className="text-xs bg-ruby-textLight/10 dark:bg-ruby-textDark/10 px-2 py-0.5 rounded opacity-70">4</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold opacity-60 hover:opacity-100 transition-opacity">
            <Headphones size={18} /> Accesorios <span className="text-xs px-2 py-0.5 rounded">5</span>
          </button>
        </div>
        
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
          <input 
            type="text" 
            placeholder="Buscar smartphone..." 
            className="w-full bg-ruby-panelLight dark:bg-ruby-panelDark border border-ruby-textLight/10 dark:border-ruby-textDark/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-ruby-accent transition-colors shadow-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-ruby-panelLight dark:bg-ruby-panelDark border border-ruby-textLight/10 dark:border-ruby-textDark/10 rounded-2xl shadow-sm">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-ruby-textLight/10 dark:border-ruby-textDark/10 text-xs opacity-60 tracking-widest uppercase">
              <th className="p-5 font-bold">Nombre</th>
              <th className="p-5 font-bold">Marca</th>
              <th className="p-5 font-bold">RAM</th>
              <th className="p-5 font-bold">Almacenamiento</th>
              <th className="p-5 font-bold text-center">Stock</th>
              <th className="p-5 font-bold">Precio Base</th>
              <th className="p-5 font-bold">Moneda</th>
              <th className="p-5 font-bold text-right">Precio Final</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ruby-textLight/5 dark:divide-ruby-textDark/5">
            <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
              <td className="p-5">
                <p className="font-bold">Samsung Galaxy S24</p>
                <p className="text-[10px] opacity-50">7501031311309</p>
              </td>
              <td className="p-5 opacity-70">Samsung</td>
              <td className="p-5 font-mono text-sm">8 GB</td>
              <td className="p-5 font-mono text-sm">256 GB</td>
              <td className="p-5">
                <div className="flex items-center justify-center gap-3">
                  <button className="opacity-0 group-hover:opacity-50 hover:!opacity-100 border border-ruby-textLight/20 dark:border-ruby-textDark/20 rounded px-2">-</button>
                  <span className="font-bold">8</span>
                  <button className="opacity-0 group-hover:opacity-50 hover:!opacity-100 border border-ruby-textLight/20 dark:border-ruby-textDark/20 rounded px-2">+</button>
                </div>
              </td>
              <td className="p-5 font-mono">$799</td>
              <td className="p-5"><span className="text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">USD</span></td>
              <td className="p-5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-500">Bs. 5.569,03</td>
            </tr>
            <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
              <td className="p-5">
                <p className="font-bold">iPhone 15 Pro</p>
                <p className="text-[10px] opacity-50">7501031311316</p>
              </td>
              <td className="p-5 opacity-70">Apple</td>
              <td className="p-5 font-mono text-sm">8 GB</td>
              <td className="p-5 font-mono text-sm">128 GB</td>
              <td className="p-5">
                <div className="flex items-center justify-center gap-3">
                  <button className="opacity-0 group-hover:opacity-50 hover:!opacity-100 border border-ruby-textLight/20 dark:border-ruby-textDark/20 rounded px-2">-</button>
                  <span className="font-bold">3</span>
                  <button className="opacity-0 group-hover:opacity-50 hover:!opacity-100 border border-ruby-textLight/20 dark:border-ruby-textDark/20 rounded px-2">+</button>
                </div>
              </td>
              <td className="p-5 font-mono">$1099</td>
              <td className="p-5"><span className="text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">USD</span></td>
              <td className="p-5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-500">Bs. 7.660,03</td>
            </tr>
            <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
              <td className="p-5">
                <p className="font-bold">Motorola Edge 40</p>
                <p className="text-[10px] opacity-50">-</p>
              </td>
              <td className="p-5 opacity-70">Motorola</td>
              <td className="p-5 font-mono text-sm">8 GB</td>
              <td className="p-5 font-mono text-sm">256 GB</td>
              <td className="p-5">
                <div className="flex items-center justify-center gap-3">
                  <button className="opacity-0 group-hover:opacity-50 hover:!opacity-100 border border-ruby-textLight/20 dark:border-ruby-textDark/20 rounded px-2">-</button>
                  <span className="font-bold">6</span>
                  <button className="opacity-0 group-hover:opacity-50 hover:!opacity-100 border border-ruby-textLight/20 dark:border-ruby-textDark/20 rounded px-2">+</button>
                </div>
              </td>
              <td className="p-5 font-mono">Bs. 1850</td>
              <td className="p-5"><span className="text-[10px] font-bold bg-gray-500/10 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">BOB</span></td>
              <td className="p-5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-500">Bs. 1.850,00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
// 1. Importamos los íconos
import { Zap, LayoutDashboard, ShoppingBag, Package, LineChart, Users, Sun, Moon, LogOut } from 'lucide-react';

export default function SidebarGerente() {
  const [modoOscuro, setModoOscuro] = useState(true);

  useEffect(() => {
    if (modoOscuro) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [modoOscuro]);

  const clasesEnlace = ({ isActive }: { isActive: boolean }) => 
    `w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
      isActive 
        ? 'bg-ruby-accent/10 border border-ruby-accent/20 text-ruby-accent font-bold' 
        : 'font-semibold opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
    }`;

  return (
    <aside className="w-64 h-screen bg-ruby-panelLight dark:bg-ruby-panelDark border-r border-ruby-textLight/10 dark:border-ruby-textDark/10 flex flex-col justify-between transition-colors duration-300">
      
      <div>
        <div className="p-6 flex items-center gap-3 border-b border-ruby-textLight/5 dark:border-ruby-textDark/5">
          <div className="w-10 h-10 bg-ruby-accent rounded-lg flex items-center justify-center text-white">
            {/* Ícono de Rayo */}
            <Zap size={24} fill="currentColor" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight">Virgen de<br/>Copacabana</h1>
            <p className="text-[10px] text-ruby-accent tracking-widest mt-1">GERENCIA</p>
          </div>
        </div>

        <nav className="p-4 space-y-2 mt-2">
          <NavLink to="/dashboard" className={clasesEnlace}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          
          <NavLink to="/vender" className={clasesEnlace}>
            <ShoppingBag size={20} /> Vender
          </NavLink>
          
          <NavLink to="/inventario" className={clasesEnlace}>
            <Package size={20} /> Inventario
          </NavLink>
          
          <NavLink to="/reportes" className={clasesEnlace}>
            <LineChart size={20} /> Reportes
          </NavLink>
          
          <NavLink to="/empleados" className={clasesEnlace}>
            <Users size={20} /> Empleados
          </NavLink>
        </nav>
      </div>

      <div className="p-4 border-t border-ruby-textLight/10 dark:border-ruby-textDark/10">
        
        <div className="flex items-center gap-3 mb-6 p-2">
          <div className="w-10 h-10 rounded-full bg-ruby-accent/20 text-ruby-accent flex items-center justify-center font-bold border border-ruby-accent/30">
            GM
          </div>
          <div>
            <p className="font-bold text-sm">Gerente</p>
            <p className="text-xs opacity-60">Admin</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 mb-4">
          <div 
            onClick={() => setModoOscuro(!modoOscuro)}
            className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${modoOscuro ? 'bg-ruby-accent' : 'bg-gray-300 dark:bg-gray-700'}`}
          >
            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${modoOscuro ? 'translate-x-7' : 'translate-x-0'}`}></div>
          </div>
          <span className="text-sm font-semibold opacity-70 flex items-center gap-2">
            {/* Íconos de Sol y Luna */}
            {modoOscuro ? <><Moon size={16} /> Modo Oscuro</> : <><Sun size={16} /> Modo Claro</>}
          </span>
        </div>

        <button className="w-full flex items-center gap-3 p-2 text-sm font-bold opacity-70 hover:opacity-100 hover:text-ruby-accent transition-colors">
          <LogOut size={20} /> Cerrar Sesión
        </button>

      </div>
    </aside>
  );
}
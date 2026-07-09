import { useState } from 'react';
import { Menu } from 'lucide-react';
import SidebarGerente from './SidebarGerente';

export default function LayoutGerente({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-ruby-bgLight dark:bg-ruby-bgDark text-ruby-textLight dark:text-ruby-textDark overflow-hidden transition-colors duration-300">
      
      {/* Fondo oscuro borroso para móvil cuando el menú está abierto */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar: En móvil es flotante (fixed), en PC es fijo (relative) */}
      <div className={`fixed md:relative z-50 h-full transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <SidebarGerente onClose={() => setSidebarOpen(false)} />
      </div>

      <main className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
        
        {/* Cabecera Móvil (SOLO visible en celulares) */}
        <header className="md:hidden flex items-center justify-between p-4 bg-ruby-panelLight dark:bg-ruby-panelDark border-b border-ruby-textLight/10 dark:border-white/5">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="p-2 -ml-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="font-bold text-lg">Panel Gerencial</h1>
          </div>
        </header>

        {/* El contenido de las páginas (Dashboard, Inventario, etc.) */}
        <div className="flex-1 overflow-hidden relative">
          {children}
        </div>
      </main>

    </div>
  );
}
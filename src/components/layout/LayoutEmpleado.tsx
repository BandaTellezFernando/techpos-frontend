import { useState, useEffect } from 'react';
import { Moon, Sun, LogOut } from 'lucide-react';

export default function LayoutEmpleado({ children }: { children: React.ReactNode }) {
  const [modoOscuro, setModoOscuro] = useState(true);

  useEffect(() => {
    if (modoOscuro) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [modoOscuro]);

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-md mx-auto bg-ruby-bgLight dark:bg-ruby-bgDark text-ruby-textLight dark:text-ruby-textDark overflow-hidden transition-colors duration-300 relative shadow-2xl">
      
      <header className="flex justify-between items-center p-4 bg-ruby-panelLight dark:bg-ruby-panelDark border-b border-ruby-textLight/10 dark:border-ruby-textDark/10 z-20 transition-colors">
        
        {/* INFO VENDEDORA */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-ruby-accent/20 text-ruby-accent flex items-center justify-center font-bold text-sm border border-ruby-accent/10">
            AQ
          </div>
          <div>
            <p className="text-[10px] opacity-60 uppercase tracking-widest font-bold leading-none mb-1">Vendedora</p>
            <p className="font-bold text-sm leading-none">Ana Quispe</p>
          </div>
        </div>

        {/* CONTROLES (Switch y Cerrar) */}
        <div className="flex items-center gap-3">
          
          {/* Switch Modo Oscuro Idéntico a Figma */}
          <div className="flex items-center gap-2">
            <div 
              onClick={() => setModoOscuro(!modoOscuro)}
              className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors flex items-center ${modoOscuro ? 'bg-ruby-accent' : 'bg-ruby-textLight/20'}`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${modoOscuro ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </div>
            <span className="opacity-60 text-ruby-textLight dark:text-ruby-textDark">
              {modoOscuro ? <Moon size={16} /> : <Sun size={16} />}
            </span>
          </div>
          
          {/* Botón Cerrar */}
          <button className="flex items-center gap-1.5 border border-ruby-accent/30 text-ruby-accent px-3 py-1.5 rounded-lg active:bg-ruby-accent/10 transition-colors">
            <LogOut size={16} strokeWidth={2.5} />
            <span className="text-sm font-bold">Cerrar</span>
          </button>
          
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {children}
      </main>

    </div>
  );
}
import SidebarGerente from './SidebarGerente';

export default function LayoutGerente({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-ruby-bgLight dark:bg-ruby-bgDark text-ruby-textLight dark:text-ruby-textDark overflow-hidden transition-colors duration-300">
      
      {/* Sidebar */}
      <div className="dark:bg-black/20 z-20 shadow-xl">
        <SidebarGerente />
      </div>

      {/* Contenedor principal: Quitamos el "flex" y aseguramos que ocupe todo el espacio */}
      <main className="flex-1 relative w-full h-full overflow-hidden">
        {children}
      </main>

    </div>
  );
}
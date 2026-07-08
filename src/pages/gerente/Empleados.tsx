//src/pages/gerente/Empleados.tsx
import { useState } from 'react';
import { Plus, Edit3, Hash, X } from 'lucide-react';

type Empleado = {
  id: string;
  iniciales: string;
  nombre: string;
  rol: string;
  ventas: number;
  activo: boolean;
};

// Estado Inicial Simulado
const EMPLEADOS_INICIALES: Empleado[] = [
  { id: '1', iniciales: 'CM', nombre: 'Carlos Mendoza', rol: 'Vendedor Senior', ventas: 23, activo: true },
  { id: '2', iniciales: 'AQ', nombre: 'Ana Quispe', rol: 'Vendedora', ventas: 31, activo: true },
  { id: '3', iniciales: 'LT', nombre: 'Luis Torrico', rol: 'Vendedor', ventas: 12, activo: false },
];

export default function Empleados() {
  const [empleados, setEmpleados] = useState<Empleado[]>(EMPLEADOS_INICIALES);
  const [pinMostrado, setPinMostrado] = useState<string | null>(null);
  
  // Estados para el Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [empleadoEditando, setEmpleadoEditando] = useState<Empleado | null>(null);
  
  // Estado del Formulario
  const [formData, setFormData] = useState({ nombre: '', rol: '' });

  // Función: Abrir Modal para Crear
  const abrirNuevoModal = () => {
    setEmpleadoEditando(null);
    setFormData({ nombre: '', rol: '' });
    setModalAbierto(true);
  };

  // Función: Abrir Modal para Editar
  const abrirEditarModal = (emp: Empleado) => {
    setEmpleadoEditando(emp);
    setFormData({ nombre: emp.nombre, rol: emp.rol });
    setModalAbierto(true);
  };

  // Función: Guardar (Crear o Actualizar)
  const guardarEmpleado = () => {
    if (!formData.nombre.trim()) return;

    if (empleadoEditando) {
      // Editar existente
      setEmpleados(empleados.map(emp => 
        emp.id === empleadoEditando.id ? { ...emp, nombre: formData.nombre, rol: formData.rol } : emp
      ));
    } else {
      // Crear nuevo
      const iniciales = formData.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      const nuevoEmp: Empleado = {
        id: Math.random().toString(),
        iniciales: iniciales || '??',
        nombre: formData.nombre,
        rol: formData.rol || 'Vendedor',
        ventas: 0,
        activo: true
      };
      setEmpleados([...empleados, nuevoEmp]);
    }
    setModalAbierto(false);
  };

  // Función: Activar / Desactivar (Switch)
  const toggleActivo = (id: string) => {
    setEmpleados(empleados.map(emp => 
      emp.id === id ? { ...emp, activo: !emp.activo } : emp
    ));
    setPinMostrado(null); // Ocultar PIN si lo desactivan
  };

  // Función: Generar PIN temporal
 const generarPin = () => {
    // Math.floor(10000 + Math.random() * 90000) genera un número aleatorio entre 10000 y 99999
    const pin = Math.floor(10000 + Math.random() * 90000).toString();
    setPinMostrado(pin);
  };

  const activosCount = empleados.filter(e => e.activo).length;

  return (
    <div className="flex flex-col h-full animate-fade-in p-8 overflow-y-auto w-full relative">
      
      {/* Cabecera */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold">Empleados</h2>
          <p className="opacity-70 mt-1">{activosCount} activos de {empleados.length}</p>
        </div>
        <button 
          onClick={abrirNuevoModal}
          className="bg-ruby-panelLight dark:bg-ruby-panelDark border border-ruby-textLight/20 dark:border-ruby-textDark/20 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors shadow-sm"
        >
          <Plus size={18} /> Nuevo Empleado
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        
        {/* LISTA DE EMPLEADOS */}
        <div className="space-y-4">
          {empleados.map((emp) => (
            <div key={emp.id} className={`bg-ruby-panelLight dark:bg-ruby-panelDark border border-ruby-textLight/10 dark:border-ruby-textDark/10 p-5 rounded-2xl flex justify-between items-center transition-all shadow-sm ${!emp.activo ? 'opacity-60 grayscale-[50%]' : ''}`}>
              
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border ${emp.activo ? 'bg-ruby-accent/20 text-ruby-accent border-ruby-accent/30' : 'bg-black/10 dark:bg-white/10 border-black/10 dark:border-white/10'}`}>
                  {emp.iniciales}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg leading-none">{emp.nombre}</h3>
                    
                    {/* Switch Toggle Custom */}
                    <div 
                      onClick={() => toggleActivo(emp.id)}
                      className={`w-9 h-5 rounded-full p-0.5 cursor-pointer transition-colors flex items-center shadow-inner ${emp.activo ? 'bg-emerald-500' : 'bg-ruby-textLight/20 dark:bg-white/10'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${emp.activo ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>

                  </div>
                  <p className="text-xs opacity-60">{emp.rol}</p>
                  <p className="text-xs font-mono mt-1 opacity-80">{emp.ventas} ventas este mes</p>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-2">
                <button 
                  onClick={() => abrirEditarModal(emp)}
                  className="flex items-center justify-center w-10 h-10 border border-ruby-textLight/20 dark:border-ruby-textDark/20 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <Edit3 size={18} />
                </button>

                <button 
                  onClick={generarPin}
                  disabled={!emp.activo}
                  className="flex items-center gap-2 border border-ruby-textLight/20 dark:border-ruby-textDark/20 px-4 py-2 rounded-lg font-bold text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <Hash size={16} className="text-ruby-accent" /> PIN
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* PANEL GENERADOR DE PIN */}
        <div className="bg-ruby-panelLight dark:bg-ruby-panelDark border border-ruby-textLight/10 dark:border-ruby-textDark/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center border-dashed shadow-sm min-h-[300px]">
          {pinMostrado ? (
            <div className="animate-fade-in flex flex-col items-center">
              <span className="text-sm font-bold text-ruby-accent tracking-widest uppercase mb-4">PIN Temporal Generado</span>
              <div className="text-6xl font-black font-mono tracking-[0.2em] text-ruby-priceLight dark:text-ruby-priceDark bg-black/5 dark:bg-white/5 py-6 px-10 rounded-2xl border border-ruby-textLight/10 dark:border-white/10 shadow-inner">
                {pinMostrado}
              </div>
              <p className="opacity-60 mt-6 text-sm max-w-xs">Comparte este código con el vendedor. Expirará cuando termine su turno.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center opacity-40">
              <Hash size={64} strokeWidth={1} className="mb-4" />
              <p className="max-w-xs font-medium">Selecciona un empleado activo y pulsa "PIN" para generar su código de acceso al POS móvil.</p>
            </div>
          )}
        </div>

      </div>

      {/* ==========================================
          MODAL (NUEVO / EDITAR EMPLEADO)
          ========================================== */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-ruby-bgLight dark:bg-ruby-bgDark w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-ruby-textLight/10 dark:border-white/10">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center p-6 border-b border-ruby-textLight/10 dark:border-white/5 bg-ruby-panelLight dark:bg-ruby-panelDark">
              <h3 className="font-bold text-xl">{empleadoEditando ? 'Editar Empleado' : 'Nuevo Empleado'}</h3>
              <button onClick={() => setModalAbierto(false)} className="opacity-50 hover:opacity-100"><X size={24} /></button>
            </div>

            {/* Formulario */}
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold opacity-50 tracking-widest uppercase mb-2 block">Nombre Completo</label>
                <input 
                  type="text" 
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej. Ana Quispe" 
                  className="w-full bg-ruby-panelLight dark:bg-[#261C1D] border border-ruby-textLight/20 dark:border-white/10 rounded-xl py-3 px-4 outline-none focus:border-ruby-accent transition-colors" 
                  autoFocus
                />
              </div>
              <div>
                <label className="text-[10px] font-bold opacity-50 tracking-widest uppercase mb-2 block">Rol / Cargo</label>
                <input 
                  type="text" 
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  placeholder="Ej. Vendedora" 
                  className="w-full bg-ruby-panelLight dark:bg-[#261C1D] border border-ruby-textLight/20 dark:border-white/10 rounded-xl py-3 px-4 outline-none focus:border-ruby-accent transition-colors" 
                />
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-3 p-6 border-t border-ruby-textLight/10 dark:border-white/5 bg-ruby-panelLight dark:bg-ruby-panelDark">
              <button 
                onClick={() => setModalAbierto(false)}
                className="flex-1 py-3 rounded-xl font-bold border border-ruby-textLight/20 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={guardarEmpleado}
                disabled={!formData.nombre.trim()}
                className="flex-1 py-3 rounded-xl font-bold bg-ruby-accent text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Guardar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
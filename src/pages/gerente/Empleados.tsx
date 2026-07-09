//src/pages/gerente/Empleados.tsx
import { useState, useEffect } from 'react';
import { Plus, Edit3, Hash, X } from 'lucide-react';
import api from '../../api/axios'; 

type Empleado = {
  _id: string;
  nombreCompleto: string;
  ci: string;
  celular: string;
  rol: string;
  estado: 'activo' | 'inactivo';
  ventas?: number;
};

export default function Empleados() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [pinMostrado, setPinMostrado] = useState<string | null>(null);
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [empleadoEditando, setEmpleadoEditando] = useState<Empleado | null>(null);
  
  const [formData, setFormData] = useState({ nombreCompleto: '', rol: 'Vendedor', ci: '', celular: '' });

  const cargarEmpleados = async () => {
    try {
      setCargando(true);
      const res = await api.get('/auth/empleados');
      setEmpleados(res.data.empleados);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    // Usamos setTimeout para evitar el error del linter de React
    setTimeout(() => {
      cargarEmpleados();
    }, 0);
  }, []);

  const abrirNuevoModal = () => {
    setEmpleadoEditando(null);
    setFormData({ nombreCompleto: '', rol: 'Vendedor', ci: '', celular: '' });
    setModalAbierto(true);
  };

  const abrirEditarModal = (emp: Empleado) => {
    setEmpleadoEditando(emp);
    setFormData({ nombreCompleto: emp.nombreCompleto, rol: emp.rol, ci: emp.ci, celular: emp.celular });
    setModalAbierto(true);
  };

  const guardarEmpleado = async () => {
    if (!formData.nombreCompleto.trim() || !formData.ci.trim() || !formData.celular.trim()) {
      alert("Por favor llena todos los campos obligatorios");
      return;
    }

    try {
      if (empleadoEditando) {
        await api.put(`/auth/empleados/${empleadoEditando._id}`, { 
          nombreCompleto: formData.nombreCompleto, 
          rol: formData.rol 
        });
      } else {
        await api.post('/auth/empleados', formData);
      }
      setModalAbierto(false);
      cargarEmpleados(); 
    } catch (error) {
      // Reemplazamos el 'any' tipando el error al estilo Axios
      const err = error as { response?: { data?: { mensaje?: string } } };
      alert(err.response?.data?.mensaje || 'Error al guardar el empleado');
    }
  };

  const toggleActivo = async (emp: Empleado) => {
    const nuevoEstado = emp.estado === 'activo' ? 'inactivo' : 'activo';
    try {
      await api.put(`/auth/empleados/${emp._id}`, { estado: nuevoEstado });
      setPinMostrado(null);
      cargarEmpleados();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const generarPin = async (empleadoId: string) => {
    try {
      const res = await api.post('/auth/generar-codigo', { empleadoId, horasValidez: 8 });
      setPinMostrado(res.data.codigo); 
    } catch (error) {
      // Reemplazamos el 'any' tipando el error al estilo Axios
      const err = error as { response?: { data?: { mensaje?: string } } };
      alert(err.response?.data?.mensaje || 'Error al generar código');
    }
  };

  const activosCount = empleados.filter(e => e.estado === 'activo').length;

  return (
    <div className="flex flex-col h-full animate-fade-in p-8 overflow-y-auto w-full relative">
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold">Empleados</h2>
          <p className="opacity-70 mt-1">{cargando ? 'Cargando...' : `${activosCount} activos de ${empleados.length}`}</p>
        </div>
        <button 
          onClick={abrirNuevoModal}
          className="bg-ruby-panelLight dark:bg-ruby-panelDark border border-ruby-textLight/20 dark:border-ruby-textDark/20 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors shadow-sm"
        >
          <Plus size={18} /> Nuevo Empleado
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        
        <div className="space-y-4">
          {empleados.map((emp) => {
            const iniciales = emp.nombreCompleto.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            const esActivo = emp.estado === 'activo';

            return (
              <div key={emp._id} className={`bg-ruby-panelLight dark:bg-ruby-panelDark border border-ruby-textLight/10 dark:border-ruby-textDark/10 p-5 rounded-2xl flex justify-between items-center transition-all shadow-sm ${!esActivo ? 'opacity-60 grayscale-[50%]' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border ${esActivo ? 'bg-ruby-accent/20 text-ruby-accent border-ruby-accent/30' : 'bg-black/10 dark:bg-white/10 border-black/10 dark:border-white/10'}`}>
                    {iniciales}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg leading-none">{emp.nombreCompleto}</h3>
                      <div 
                        onClick={() => toggleActivo(emp)}
                        className={`w-9 h-5 rounded-full p-0.5 cursor-pointer transition-colors flex items-center shadow-inner ${esActivo ? 'bg-emerald-500' : 'bg-ruby-textLight/20 dark:bg-white/10'}`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${esActivo ? 'translate-x-4' : 'translate-x-0'}`}></div>
                      </div>
                    </div>
                    <p className="text-xs opacity-60">{emp.rol}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => abrirEditarModal(emp)}
                    className="flex items-center justify-center w-10 h-10 border border-ruby-textLight/20 dark:border-ruby-textDark/20 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <Edit3 size={18} />
                  </button>

                  <button 
                    onClick={() => generarPin(emp._id)}
                    disabled={!esActivo}
                    className="flex items-center gap-2 border border-ruby-textLight/20 dark:border-ruby-textDark/20 px-4 py-2 rounded-lg font-bold text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    <Hash size={16} className="text-ruby-accent" /> PIN
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-ruby-panelLight dark:bg-ruby-panelDark border border-ruby-textLight/10 dark:border-ruby-textDark/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center border-dashed shadow-sm min-h-[300px]">
          {pinMostrado ? (
            <div className="animate-fade-in flex flex-col items-center">
              <span className="text-sm font-bold text-ruby-accent tracking-widest uppercase mb-4">PIN Temporal Generado</span>
              <div className="text-6xl font-black font-mono tracking-[0.2em] text-ruby-priceLight dark:text-ruby-priceDark bg-black/5 dark:bg-white/5 py-6 px-10 rounded-2xl border border-ruby-textLight/10 dark:border-white/10 shadow-inner">
                {pinMostrado}
              </div>
              <p className="opacity-60 mt-6 text-sm max-w-xs">Comparte este código de 6 dígitos con el vendedor para la App Móvil.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center opacity-40">
              <Hash size={64} strokeWidth={1} className="mb-4" />
              <p className="max-w-xs font-medium">Selecciona un empleado activo y pulsa "PIN" para generar su código de acceso al POS móvil.</p>
            </div>
          )}
        </div>
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-ruby-bgLight dark:bg-ruby-bgDark w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-ruby-textLight/10 dark:border-white/10">
            
            <div className="flex justify-between items-center p-6 border-b border-ruby-textLight/10 dark:border-white/5 bg-ruby-panelLight dark:bg-ruby-panelDark">
              <h3 className="font-bold text-xl">{empleadoEditando ? 'Editar Empleado' : 'Nuevo Empleado'}</h3>
              <button onClick={() => setModalAbierto(false)} className="opacity-50 hover:opacity-100"><X size={24} /></button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold opacity-50 tracking-widest uppercase mb-2 block">Nombre Completo</label>
                <input 
                  type="text" 
                  value={formData.nombreCompleto}
                  onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                  placeholder="Ej. Ana Quispe" 
                  className="w-full bg-ruby-panelLight dark:bg-[#261C1D] border border-ruby-textLight/20 dark:border-white/10 rounded-xl py-3 px-4 outline-none focus:border-ruby-accent transition-colors" 
                  autoFocus
                />
              </div>
              <div>
                <label className="text-[10px] font-bold opacity-50 tracking-widest uppercase mb-2 block">C.I. (Obligatorio)</label>
                <input 
                  type="text" 
                  disabled={!!empleadoEditando} 
                  value={formData.ci}
                  onChange={(e) => setFormData({ ...formData, ci: e.target.value })}
                  placeholder="Carnet de Identidad" 
                  className="w-full bg-ruby-panelLight dark:bg-[#261C1D] border border-ruby-textLight/20 dark:border-white/10 rounded-xl py-3 px-4 outline-none focus:border-ruby-accent transition-colors disabled:opacity-50" 
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-[10px] font-bold opacity-50 tracking-widest uppercase mb-2 block">Celular</label>
                  <input 
                    type="text" 
                    disabled={!!empleadoEditando}
                    value={formData.celular}
                    onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                    placeholder="Ej. 77712345" 
                    className="w-full bg-ruby-panelLight dark:bg-[#261C1D] border border-ruby-textLight/20 dark:border-white/10 rounded-xl py-3 px-4 outline-none focus:border-ruby-accent transition-colors disabled:opacity-50" 
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-bold opacity-50 tracking-widest uppercase mb-2 block">Rol / Cargo</label>
                  <input 
                    type="text" 
                    value={formData.rol}
                    onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                    placeholder="Ej. Vendedor" 
                    className="w-full bg-ruby-panelLight dark:bg-[#261C1D] border border-ruby-textLight/20 dark:border-white/10 rounded-xl py-3 px-4 outline-none focus:border-ruby-accent transition-colors" 
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-ruby-textLight/10 dark:border-white/5 bg-ruby-panelLight dark:bg-ruby-panelDark">
              <button 
                onClick={() => setModalAbierto(false)}
                className="flex-1 py-3 rounded-xl font-bold border border-ruby-textLight/20 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={guardarEmpleado}
                className="flex-1 py-3 rounded-xl font-bold bg-ruby-accent text-white hover:opacity-90 transition-opacity"
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
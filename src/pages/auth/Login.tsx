import { useState } from 'react';
import { Zap, AlertTriangle, X } from 'lucide-react';
import api from '../../api/axios';

export default function Login() {
  const [pin, setPin] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [modalInactivo, setModalInactivo] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;
    
    try {
      setCargando(true);
      setError('');
      
      // Llamamos a la nueva ruta unificada
      const res = await api.post('/auth/login', { pin });
      
      // Guardamos la sesión
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('rol', res.data.rol);
      
      // Redirigimos según el rol
      if (res.data.rol === 'Gerente') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/pos';
      }
    } catch (error) {
      // AQUÍ ESTÁ LA MAGIA DE TYPESCRIPT: Le decimos qué forma tiene el error de Axios
      const err = error as { response?: { data?: { mensaje?: string } } };
      
      if (err.response?.data?.mensaje === 'INACTIVO') {
        setModalInactivo(true); // Dispara el modal de bloqueo
      } else {
        setError(err.response?.data?.mensaje || 'Error al iniciar sesión');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1414] text-white flex flex-col items-center justify-center p-4">
      
      <div className="w-16 h-16 bg-ruby-accent rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(225,29,72,0.3)] mb-6 animate-pulse-slow">
        <Zap size={32} fill="currentColor" />
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-black tracking-tight mb-2">Virgen de Copacabana</h1>
        <p className="text-ruby-accent font-bold tracking-widest text-sm uppercase">Punto de Venta</p>
      </div>

      <form onSubmit={handleLogin} className="w-full max-w-xs flex flex-col gap-4">
        <div>
          <label className="text-xs font-bold opacity-50 tracking-widest uppercase mb-2 block text-center">Ingresa tu PIN</label>
          <input 
            type="password" 
            autoFocus
            maxLength={10}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-4 text-center text-3xl font-mono tracking-[0.3em] outline-none focus:border-ruby-accent transition-colors"
          />
        </div>

        {error && <p className="text-ruby-accent text-sm font-bold text-center">{error}</p>}

        <button 
          disabled={cargando || pin.length < 5}
          className="w-full bg-ruby-accent text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-ruby-accent/20 hover:bg-ruby-accent/90 active:scale-95 transition-all mt-4 disabled:opacity-50 disabled:shadow-none"
        >
          {cargando ? 'Verificando...' : 'Iniciar Sesión'}
        </button>
      </form>

      {/* MODAL EMPLEADO INACTIVO */}
      {modalInactivo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#261C1D] w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-ruby-accent/30 text-center relative">
            <button onClick={() => setModalInactivo(false)} className="absolute top-4 right-4 opacity-50 hover:opacity-100"><X size={24} /></button>
            <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">Acceso Denegado</h3>
            <p className="opacity-70 text-sm mb-6">Tu usuario se encuentra actualmente desactivado. Por favor, comunícate con la Gerencia para restaurar tu acceso al sistema.</p>
            <button onClick={() => setModalInactivo(false)} className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl font-bold transition-colors">Entendido</button>
          </div>
        </div>
      )}
    </div>
  );
}
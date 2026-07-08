import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios'; // Importamos nuestra conexión real

export default function Login() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [modo, setModo] = useState<'gerencia' | 'empleado'>('gerencia');
  
  // Nuevo: Necesitamos el CI del gerente para el backend. 
  // En la vida real, podrías pedirlo en un input antes del PIN.
  // Por ahora lo dejaremos quemado con el CI de tu "seeder".
  const ciGerente = '12345678'; 
  
  const navigate = useNavigate();

  useEffect(() => {
    if (pin.length === 5) {
      
      const iniciarSesion = async () => {
        try {
          if (modo === 'gerencia') {
            // 1. PETICIÓN REAL AL BACKEND PARA GERENTE
            const response = await api.post('/auth/login', {
              ci: ciGerente,
              pin: pin
            });
            
            // Si el backend responde bien, guardamos el token y entramos
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
            navigate('/dashboard');

          } else {
            // 2. PETICIÓN REAL AL BACKEND PARA EMPLEADO
            // (El backend del empleado pide 'codigo', que es el PIN temporal de 6 dígitos que genera el gerente)
            // *Nota: Tu backend espera 6 dígitos para empleado, pero tu UI del PIN tiene 5. 
            // Quizás quieras cambiar tu generarCodigo a 5 dígitos, o el UI a 6.*
            const response = await api.post('/auth/login-codigo', {
              codigo: pin 
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
            navigate('/pos');
          }
        } catch (error) {
          // 1. Imprimimos el error en consola (así ESLint deja de quejarse porque ya le dimos uso a la variable)
          console.error("Error en la autenticación:", error);

          // 2. Si el backend lanza error (PIN incorrecto, cuenta desactivada...)
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 500);
        }
      };

      iniciarSesion();
    }
  }, [pin, navigate, modo]);



  const presionarTecla = (numero: string) => {
    if (pin.length < 5) {
      setPin(prev => prev + numero);
      setError(false);
    }
  };

  const borrarTecla = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  // Botones del teclado numérico
  const teclas = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    // Forzamos el modo oscuro por defecto para esta pantalla basándonos en tu diseño
    <div className="dark h-screen w-full bg-[#1A1515] text-[#FEE2E2] flex flex-col items-center justify-center font-sans relative overflow-hidden selection:bg-ruby-accent/30">
      
      {/* Botón sutil para cambiar entre vista de Gerente y Empleado (Solo para desarrollo/pruebas) */}
      <div className="absolute top-8 flex gap-4 bg-white/5 p-1 rounded-lg border border-white/10">
        <button 
          onClick={() => { setModo('gerencia'); setPin(''); }}
          className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${modo === 'gerencia' ? 'bg-ruby-accent text-white' : 'opacity-50'}`}
        >
          Gerencia (12345)
        </button>
        <button 
          onClick={() => { setModo('empleado'); setPin(''); }}
          className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${modo === 'empleado' ? 'bg-ruby-accent text-white' : 'opacity-50'}`}
        >
          Empleado (11111)
        </button>
      </div>

      <div className="flex flex-col items-center w-full max-w-sm animate-fade-in">
        
        {/* LOGO */}
        <div className="w-16 h-16 rounded-2xl border border-ruby-accent/30 bg-ruby-accent/10 flex items-center justify-center text-3xl mb-6 shadow-[0_0_30px_rgba(239,68,68,0.15)] text-ruby-accent">
          ⚡
        </div>

        {/* TÍTULOS */}
        <h1 className="text-2xl font-bold tracking-wide">Virgen de Copacabana</h1>
        <p className="text-ruby-accent opacity-80 mt-1 mb-10 text-sm font-medium tracking-wider">
          {modo === 'gerencia' ? 'Acceso de Gerencia' : 'Acceso de Vendedor'}
        </p>

        {/* INDICADOR DE PIN */}
        <p className="text-xs font-bold tracking-[0.2em] opacity-60 mb-4 uppercase">PIN de Seguridad</p>
        <div className={`flex gap-4 mb-10 transition-transform ${error ? 'animate-shake' : ''}`}>
          {[0, 1, 2, 3, 4].map((index) => (
            <div 
              key={index} 
              className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                index < pin.length 
                  ? (error ? 'bg-red-500 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-ruby-accent border-ruby-accent shadow-[0_0_15px_rgba(239,68,68,0.3)]')
                  : 'border-white/10 bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* TECLADO NUMÉRICO */}
        <div className="grid grid-cols-3 gap-3 w-full px-6">
          {teclas.map((num) => (
            <button 
              key={num}
              onClick={() => presionarTecla(num)}
              className="h-16 bg-[#261C1D] border border-white/5 rounded-2xl text-2xl font-bold flex items-center justify-center active:bg-ruby-accent/20 active:border-ruby-accent/50 active:scale-95 transition-all shadow-sm"
            >
              {num}
            </button>
          ))}
          
          {/* Espacio vacío inferior izquierdo */}
          <div></div>
          
          {/* Cero */}
          <button 
            onClick={() => presionarTecla('0')}
            className="h-16 bg-[#261C1D] border border-white/5 rounded-2xl text-2xl font-bold flex items-center justify-center active:bg-ruby-accent/20 active:border-ruby-accent/50 active:scale-95 transition-all shadow-sm"
          >
            0
          </button>
          
          {/* Botón de Borrar (Backspace) */}
          <button 
            onClick={borrarTecla}
            className="h-16 bg-[#261C1D] border border-white/5 rounded-2xl text-xl opacity-70 flex items-center justify-center active:bg-white/10 active:scale-95 transition-all shadow-sm hover:opacity-100"
          >
            ⌫
          </button>
        </div>

        <button className="mt-10 text-sm font-semibold opacity-60 hover:opacity-100 hover:text-ruby-accent transition-colors">
          ¿Olvidaste tu PIN?
        </button>

      </div>
    </div>
  );
}
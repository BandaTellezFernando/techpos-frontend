import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import LayoutGerente from './components/layout/LayoutGerente';
import LayoutEmpleado from './components/layout/LayoutEmpleado';

// Páginas Públicas
import Login from './pages/auth/Login';

// Páginas Gerente
import Dashboard from './pages/gerente/Dashboard';
import VentasDesktop from './pages/gerente/VentasDesktop';
import Inventario from './pages/gerente/Inventario';
import Reportes from './pages/gerente/Reportes';
import Empleados from './pages/gerente/Empleados';

// Páginas Empleado
import POSMobile from './pages/empleado/POSMobile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA PÚBLICA DE ACCESO */}
        <Route path="/" element={<Login />} />
        
        {/* ==========================================
            RUTAS DE GERENCIA (Envueltas en su Layout)
            ========================================== */}
        <Route path="/dashboard" element={<LayoutGerente><Dashboard /></LayoutGerente>} />
        <Route path="/vender" element={<LayoutGerente><VentasDesktop /></LayoutGerente>} />
        <Route path="/inventario" element={<LayoutGerente><Inventario /></LayoutGerente>} />
        <Route path="/reportes" element={<LayoutGerente><Reportes /></LayoutGerente>} />
        <Route path="/empleados" element={<LayoutGerente><Empleados /></LayoutGerente>} />

        {/* ==========================================
            RUTAS DE EMPLEADO (Envueltas en su Layout)
            ========================================== */}
        <Route path="/pos" element={<LayoutEmpleado><POSMobile /></LayoutEmpleado>} />
        
        {/* Ruta de seguridad para URLs no encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
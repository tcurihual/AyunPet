import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/router';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdoptionRequestsPage from './pages/AdoptionRequestsPage'; 
import AdoptionPage from './pages/AdoptionPage'; 
import InstitutionProfilePage from './pages/InstitutionProfilePage';
import ProtectedRoute from './components/ProtectedRoute.tsx';

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rutas protegidas */}
      {/* Solo usuarios normales pueden ver solicitudes */}
      <Route 
        path="/solicitudes" 
        element={
          <ProtectedRoute roles={['normal']}>
            <AdoptionRequestsPage />
          </ProtectedRoute>
        } 
      />

      {/* Solo usuarios normales pueden acceder a adoptar */}
      <Route 
        path="/adopta" 
        element={
          <ProtectedRoute roles={['normal']}>
            <AdoptionPage />
          </ProtectedRoute>
        } 
      />

      {/* Solo instituciones pueden acceder a su muro */}
      <Route 
        path="/muro-institucion" 
        element={
          <ProtectedRoute roles={['institution']}>
            <InstitutionProfilePage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;

import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/router';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdoptionRequestsPage from './pages/AdoptionRequestsPage'; 
import AdoptionPage from './pages/AdoptionPage'; 
import InstitutionProfilePage from './pages/InstitutionProfilePage';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import Profile from "./pages/user_profile";
import Pruebas from './PruebasComponentes';
import AboutPage from './pages/AboutPage';       // ✅ Nueva vista
import CreatePostPage from './pages/CreatePostPage.tsx'; // ✅ Nueva vista

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/nosotros" element={<AboutPage />} />  {/* ✅ Nueva ruta pública */}

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

      {/* Rutas adicionales */}
      <Route path="/perfil" element={<Profile />} />
      <Route path="/pruebas" element={<Pruebas />} />
      <Route path="/crear-post" element={<CreatePostPage />} /> {/* ✅ Nueva ruta */}
    </Routes>
  );
}

export default App;

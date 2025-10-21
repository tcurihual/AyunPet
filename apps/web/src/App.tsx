import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/router';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdoptionRequestsPage from './pages/AdoptionRequestsPage';
import AdoptionPage from './pages/AdoptionPage';
import InstitutionProfilePage from './pages/InstitutionProfilePage';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import Pruebas from './PruebasComponentes';
import AboutPage from './pages/AboutPage';
import CreatePostPage from './pages/CreatePostPage.tsx';
import Maintenance from './pages/MaintenancePage';
import SearchAccountsPage from './pages/search_acounts.tsx';
import PostPage from './pages/PostPage';
import AdminPage from './pages/AdminPage';
import SavedPostsPage from './pages/SavedPostsPage';
import VerificacionAdminPage from './pages/VerificationAdminPage.tsx';
import AdminReportsPage from './pages/AdminReportsPage';
import EmailOrgPending from './pages/EmailOrgPending';
import UserProfile from './pages/perfil.tsx';

function App() {
  const maintenanceMode = false;

  if (maintenanceMode) {
    return (
      <Routes>
        <Route path="*" element={<Maintenance />} />
      </Routes>
    );
  }

  return (
    <Routes>  
      {/* Rutas públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/nosotros" element={<AboutPage />} />
      <Route path="/post" element={<PostPage />} />

      {/* Rutas protegidas */}
      <Route 
        path="/solicitudes" 
        element={
          <ProtectedRoute roles={['normal']}>
            <AdoptionRequestsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/adopta" 
        element={
          <ProtectedRoute roles={['normal']}>
            <AdoptionPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/muro-institucion" 
        element={
          <ProtectedRoute roles={['institution','tester']}>
            <InstitutionProfilePage />
          </ProtectedRoute>
        } 
      />

      {/* Otras rutas */}
      <Route path="/perfil" element={<UserProfile/>} />
      <Route path="/favoritos" element={<SavedPostsPage />} />
      <Route path="/pruebas" element={<Pruebas />} />
      <Route path="/crear-post" element={<CreatePostPage />} />
      <Route path="/maintenance" element={<Maintenance />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/BuscarCuentas" element={<SearchAccountsPage />} />
      <Route path="/verificar" element={<VerificacionAdminPage />} />
      <Route path="/admin/reportes" element={<AdminReportsPage />} />
      <Route path="/email-org-pending" element={<EmailOrgPending />} />
    </Routes>
  );
}

export default App;
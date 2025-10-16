import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/router';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdoptionRequestsPage from './pages/AdoptionRequestsPage'; 
import AdoptionPage from './pages/AdoptionPage'; 
import InstitutionProfilePage from './pages/InstitutionProfilePage';
import Profile from "./pages/user_profile";
import Pruebas from './PruebasComponentes';
import Maintenance from './pages/MaintenancePage';


function App() {
  const maintenanceMode = true;
  if (maintenanceMode) {
    return (
      <Routes>
        <Route path='*' element= {<Maintenance/>} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/register" element={<RegisterPage/>}/> 
      <Route path="/solicitudes" element={<AdoptionRequestsPage/>}/>
      <Route path="/adopta" element={<AdoptionPage/>}/> 
      <Route path="/muro-institucion" element={<InstitutionProfilePage/>}/>
      <Route path="/perfil" element={<Profile/>}/>
      <Route path="/pruebas" element={<Pruebas />}/>
      <Route path='/maintenance' element={<Maintenance />}/>
    </Routes>
  );
}

export default App;
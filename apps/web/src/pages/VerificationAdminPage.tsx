import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import VerificacionUsuarioCard from '../components/VerificacionUsuarioCard';

// Datos de prueba que simulan lo que vendría de la API
const mockUsersToVerify = [
  {
    id: '1', name: 'Miguel Fernández', rut: '20.987.xxx-x', registrationDate: '15/10/2025',
    role: 'Usuario' as const, imageUrl: '/images/avatars/miguel.jpeg', tagInfo: '23 años'
  },
  {
    id: '2', name: 'Fundación Patitas del Sur', rut: '12.345.xxx-x', registrationDate: '10/10/2025',
    role: 'Empresa' as const, imageUrl: '/images/pets/firulais.jpg', tagInfo: 'Operando desde 2010'
  },
  {
    id: '3', name: 'Tilin', rut: '21.308.xxx-x', registrationDate: '06/10/2025',
    role: 'Usuario' as const, imageUrl: '/images/avatars/tilin.jpg', tagInfo: '7 años'
  },
];

const VerificacionAdminPage: React.FC = () => {

  return (
    <div className="page-container">
    
      <main className="main-content" style={{ display: 'block', padding: '40px' }}>
        <div className="verification-header">
          <h1 className="title-center" style={{ color: '#c7a77b', margin: 0 }}>Verificación de usuarios</h1>
          <button className="verification-filter-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#333">
              <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
            </svg>
            <span>Filtrar</span>
          </button>
        </div>
        <div className="verification-list-container">
          {mockUsersToVerify.map(user => (
            <VerificacionUsuarioCard key={user.id} user={user} />
          ))}
        </div>
      </main>
     
    </div>
  );
};

export default VerificacionAdminPage;
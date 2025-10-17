import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UserCard from '../components/UserCard';
import '../index.css';

const SearchAccountsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Datos de ejemplo
  const users = [
    {
      age: '18 años',
      name: 'Agustin Callampin Bombin',
      email: 'tralelenoob27@yahoo.cl',
      phone: '+56 9 123 456 78',
      location: 'algun lugar de temuco',
      role: 'Adoptante' as const
    },
    {
      age: '20 años',
      name: 'Hector Gym bro 144hz',
      email: 'princesa27@hotmail.com',
      phone: '+56 9 123 456 78',
      location: 'algun lugar de temuco',
      role: 'Publicante' as const
    },
    {
      age: '500 años',
      name: 'Abuelo Chris',
      email: 'debruyne@noruega.uk',
      phone: '+56 9 123 456 78',
      location: 'algun lugar de temuco',
      role: 'Adoptante' as const
    }
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <Header />
      <main className="search-accounts-container">
        {/* Barra de búsqueda */}
        <div className="search-bar-wrapper">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <svg className="search-icon" viewBox="0 0 24 24" fill="#999">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>

          {/* Botón de filtro */}
          <button className="filter-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#333">
              <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
            </svg>
          </button>
        </div>

        {/* Grid de tarjetas */}
        <div className="users-grid">
          {filteredUsers.map((user, index) => (
            <UserCard key={index} {...user} />
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="no-results">
            No se encontraron usuarios con ese criterio de búsqueda.
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SearchAccountsPage;
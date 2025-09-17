import React from 'react';

const ProfileTabs: React.FC = () => {
  return (
    <nav className="profile-tabs">
      <a href="#" className="tab-item active">Publicaciones</a>
      <a href="#" className="tab-item">Sobre Nosotros</a>
      <a href="#" className="tab-item">Reseñas</a>
      <a href="#" className="tab-item">Equipo</a>
      <a href="#" className="tab-item">Documentos</a>
    </nav>
  );
};

export default ProfileTabs;
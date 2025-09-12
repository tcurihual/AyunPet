import React from 'react';

const ProfileHeader: React.FC = () => {
  return (
    <div className="profile-header">
      <img 
        src="/images/avatars/miguel.jpeg" 
        alt="Logo de la Fundación" 
        className="profile-avatar"
      />
      <div className="profile-info">
        <h2>Fundacion sigma</h2>
        <span className="profile-handle">@Sigma · Temuco</span>
        <p>Rescatamos, rehabilitamos y damos en adopción responsable a perros y gatos en situación de vulnerabilidad.</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
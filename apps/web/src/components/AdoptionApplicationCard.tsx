import React from 'react';

interface AdoptionApplication {
  id: string;
  age: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: 'Adoptante' | 'Publicante';
}

interface AdoptionApplicationCardProps {
  application: AdoptionApplication;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

const AdoptionApplicationCard: React.FC<AdoptionApplicationCardProps> = ({ 
  application, 
  onAccept, 
  onReject 
}) => {
  return (
    <div className={`adoption-application-card-horizontal ${application.role === 'Adoptante' ? 'adoptante' : 'publicante'}`}>
      {/* Columna izquierda con edad, avatar y badge */}
      <div className="adoption-card-left-section">
        <div className="adoption-card-age-badge">{application.age}</div>
        
        <div className="adoption-card-avatar-circle">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="#6D4C41">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
      </div>

      {/* Columna central con nombre y datos de contacto */}
      <div className="adoption-card-center-section">
        <h3 className="adoption-card-name-horizontal">{application.name}</h3>
        
        <div className="adoption-card-contact-row">
          <div className="adoption-contact-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <span>{application.email}</span>
          </div>
          
          <div className="adoption-contact-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            <span>{application.phone}</span>
          </div>
        </div>
        
        <div className="adoption-card-location-row">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span>{application.location}</span>
        </div>
      </div>

      {/* Columna derecha con badge de rol y botones */}
      <div className="adoption-card-right-section">
        <span className={`adoption-role-badge ${application.role === 'Adoptante' ? 'role-adoptante' : 'role-publicante'}`}>
          {application.role}
        </span>
        
        <div className="adoption-card-buttons-horizontal">
          <button 
            className="btn-adoption-horizontal btn-accept-horizontal"
            onClick={() => onAccept(application.id)}
          >
            Aceptar
          </button>
          <button 
            className="btn-adoption-horizontal btn-deny-horizontal"
            onClick={() => onReject(application.id)}
          >
            Denegar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdoptionApplicationCard;
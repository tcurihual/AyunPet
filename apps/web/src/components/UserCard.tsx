import React from 'react';
import '../index.css';

interface UserCardProps {
  age: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: 'Adoptante' | 'Publicante';
}

const UserCard: React.FC<UserCardProps> = ({ 
  age, 
  name, 
  email, 
  phone, 
  location, 
  role 
}) => {
  return (
    <div className={`user-card ${role === 'Adoptante' ? 'adoptante' : 'publicante'}`}>
      <div className="user-card-left">
        <span className="user-card-age">{age}</span>
        
        <div className="user-card-avatar">
          <svg width="50" height="50" viewBox="0 0 24 24" fill="#6D4C41">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>

        <span className={`user-card-badge ${role === 'Adoptante' ? 'badge-adoptante' : 'badge-publicante'}`}>
          {role}
        </span>
      </div>

      <div className="user-card-content">
        <h3 className="user-card-name">{name}</h3>

        <div className="user-card-details">
          <div className="user-card-detail-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#333">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <span>{email}</span>
          </div>

          <div className="user-card-detail-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#333">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            <span>{phone}</span>
          </div>

          <div className="user-card-detail-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#333">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>{location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
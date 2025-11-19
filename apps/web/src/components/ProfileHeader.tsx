import React from 'react';

interface ProfileHeaderProps {
  name: string;
  profilePicture?: string;
  profileMural?: string;
  handle?: string;
  description?: string;
  isOwnProfile?: boolean;
  onUploadClick?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  name, 
  profilePicture,
  handle = '',
  description = '',
  isOwnProfile = false,
  onUploadClick
}) => {
  return (
    <div className="profile-header">
      {profilePicture ? (
        <img 
          src={profilePicture} 
          alt={`Logo de ${name}`} 
          className="profile-avatar"
        />
      ) : (
        <div className="profile-avatar" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#e0e0e0',
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#666'
        }}>
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="profile-info">
        <h2>{name}</h2>
        {handle && <span className="profile-handle">{handle}</span>}
        {description && <p>{description}</p>}
        
        {/* ✅ BOTÓN DE CAMBIAR FOTO SI ES PERFIL PROPIO */}
        {isOwnProfile && onUploadClick && (
          <button
            onClick={onUploadClick}
            style={{
              marginTop: '1rem',
              marginLeft: '20px', // <- lo empuja 20px hacia la derecha
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}
          >
            📸 Cambiar foto de perfil
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;

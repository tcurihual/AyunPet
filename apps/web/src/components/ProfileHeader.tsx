import React from 'react';

interface ProfileHeaderProps {
  name: string;
  avatar?: string;
  handle?: string;
  description?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  name, 
  avatar = '/images/avatars/miguel.jpeg',
  handle = '',
  description = ''
}) => {
  return (
    <div className="profile-header">
      <img 
        src={avatar} 
        alt={`Logo de ${name}`} 
        className="profile-avatar"
      />
      <div className="profile-info">
        <h2>{name}</h2>
        {handle && <span className="profile-handle">{handle}</span>}
        {description && <p>{description}</p>}
      </div>
    </div>
  );
};

export default ProfileHeader;

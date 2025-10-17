import React from 'react';

interface UserToVerify {
  id: string;
  name: string;
  rut: string;
  registrationDate: string;
  role: 'Usuario' | 'Empresa';
  imageUrl: string;
  tagInfo: string; 
}

interface VerificacionUsuarioCardProps {
  user: UserToVerify;
}

const VerificacionUsuarioCard: React.FC<VerificacionUsuarioCardProps> = ({ user }) => {
  return (
    <div className="verification-card">
      <div className="verification-card-avatar">
        <img src={user.imageUrl} alt={user.name} />
        <span className="avatar-tag tag-info">{user.tagInfo}</span>
        <span className={`avatar-tag ${user.role === 'Usuario' ? 'tag-user' : 'tag-company'}`}>{user.role}</span>
      </div>
      <div className="verification-card-body">
        <h3>{user.name}</h3>
        <p>Rut: {user.rut}</p>
        <p>Fecha de registro: {user.registrationDate}</p>
      </div>
      <div className="verification-card-actions">
        <button className="btn btn-view-profile">Ver perfil</button>
        <button className="btn btn-reject">Rechazar</button>
        <button className="btn btn-verify">Verificar</button>
      </div>
    </div>
  );
};

export default VerificacionUsuarioCard;
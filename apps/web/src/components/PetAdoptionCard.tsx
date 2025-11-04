import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Publication } from '../context/PublicationsContext';

interface PetAdoptionCardProps {
  publication: Publication;
}

const PetAdoptionCard: React.FC<PetAdoptionCardProps> = ({ publication }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { creator, pet } = publication;
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  const isEmailVerified = user?.emailVerified ?? false;
  const isLoggedIn = !!user;

  const handleButtonClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!isEmailVerified) {
      setShowVerificationMessage(true);
      return;
    }

    navigate(`/pet/${publication.id}`);
  };

  return (
    <div className="pet-card">
      <div className="pet-card-content">
        <div> 
          <h3>{pet.name}</h3>
          <div className="pet-details-container">
            <span className="pet-detail-item">{pet.species}</span>
            <span className="pet-detail-item">{pet.breed}</span>
            <span className="pet-detail-item">{`${pet.age} meses`}</span>
            <span className="pet-detail-item">{pet.size}</span>
            {pet.tags.map(tag => (
              <span key={tag} className="pet-detail-item">{tag}</span>
            ))}
          </div>
        </div>
        <p className="pet-card-description">{publication.description}</p>

        {isLoggedIn && !isEmailVerified && showVerificationMessage && (
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            padding: '12px 16px',
            marginTop: '15px',
            fontSize: '14px',
            color: '#856404',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
          }}>
            <span style={{ fontSize: '18px', flexShrink: 0 }}>⚠️</span>
            <div>
              <strong style={{ display: 'block', marginBottom: '4px' }}>
                Verificación requerida
              </strong>
              <p style={{ margin: 0, lineHeight: '1.5' }}>
                Debes verificar tu correo electrónico antes de solicitar adopciones.
                Revisa tu bandeja de entrada o spam.
              </p>
              <button
                onClick={() => setShowVerificationMessage(false)}
                style={{
                  marginTop: '8px',
                  padding: '4px 12px',
                  fontSize: '12px',
                  backgroundColor: 'transparent',
                  border: '1px solid #856404',
                  borderRadius: '4px',
                  color: '#856404',
                  cursor: 'pointer'
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        <div className="pet-card-footer">
          <div className="pet-card-tags">
            {pet.sterilized && (
              <span className="pet-tag sterilized">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Esterilizado
              </span>
            )}
            {pet.healthStatus && (
              <span className="pet-tag healthy">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                {pet.healthStatus}
              </span>
            )}
          </div>
          
          <div className="pet-card-submitter">
              <p className="pet-card-submitter-name">Publicado por: <strong>{creator.name}</strong></p>
          </div>
        </div>
      </div>

      <div className="pet-card-aside">
        <img src={pet.image} alt={pet.name} className="pet-card-pet-img" />
        <div className="card-spacer"></div>
        <div className="pet-card-actions">
          <button
            className="btn btn-primary"
            onClick={handleButtonClick}
            disabled={isLoggedIn && !isEmailVerified}
            style={{
              opacity: (isLoggedIn && !isEmailVerified) ? 0.65 : 1,
              cursor: (isLoggedIn && !isEmailVerified) ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s ease'
            }}
            title={
              !isLoggedIn
                ? 'Inicia sesión para ver detalles'
                : !isEmailVerified
                  ? 'Debes verificar tu correo primero'
                  : 'Ver información completa'
            }
          >
            {!isLoggedIn
              ? 'Ver Detalles'
              : !isEmailVerified
                ? 'Verificar Email'
                : 'Ver Detalles'
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetAdoptionCard;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Publication } from '../context/PublicationsContext';

interface PetAdoptionCardProps {
  publication: Publication;
}

const PetAdoptionCard: React.FC<PetAdoptionCardProps> = ({ publication }) => {
  const { creator, pet, post } = publication;
  const [imageError, setImageError] = React.useState(false);

  const imageUrl = React.useMemo(() => {
    if (imageError) return 'https://via.placeholder.com/300x300?text=Sin+Imagen';
    const url = post.images?.[0] || pet.images?.[0];
    // Usar proxy CORS para solucionar el bloqueo temporal
    if (url && url.includes('ayunpet-api')) {
      return `https://corsproxy.io/?${encodeURIComponent(url)}`;
    }
    return url || 'https://via.placeholder.com/300x300?text=Sin+Imagen';
  }, [post.images, pet.images, imageError]);

  return (
    <div className="pet-card">
      <div className="pet-card-content">
        <div>
          <h3>{pet.name}</h3>
          <div className="pet-details-container">
            <span className="pet-detail-item">{pet.species}</span>
            <span className="pet-detail-item">{pet.breed}</span>
            <span className="pet-detail-item">{`${Math.floor(pet.age / 12)} años, ${pet.age % 12} meses`}</span>
            <span className="pet-detail-item">{pet.size}</span>
            {pet.tags?.map(tag => (
              <span key={tag} className="pet-detail-item">{tag}</span>
            ))}
          </div>
        </div>
        <p className="pet-card-description">{publication.description}</p>
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
        <img 
          src={imageUrl}
          alt={pet.name} 
          className="pet-card-pet-img"
          onError={() => {
            console.error('Error al cargar imagen:', imageUrl);
            setImageError(true);
          }}
        />
        <div className="card-spacer"></div>
        <div className="pet-card-actions">
          <button className="btn btn-primary" onClick={handleViewDetails}>
            Ver Detalles
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetAdoptionCard;

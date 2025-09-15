import React from 'react';
import type { Publication } from '../context/PublicationsContext'; 

interface PetAdoptionCardProps {
  publication: Publication;
}

const PetAdoptionCard: React.FC<PetAdoptionCardProps> = ({ publication }) => {
  const { petName, petImage, description, submitterName, date } = publication;

  return (
    <div className="pet-card">
      <div className="pet-card-content">
        <h3>{petName}</h3>
        <p className="pet-card-description">{description}</p>
        <div className="pet-card-submitter">
          <div>
            <p className="pet-card-submitter-name">Publicado por: <strong>{submitterName}</strong></p>
            <p className="pet-card-submitter-date">Fecha: {date}</p>
          </div>
        </div>
      </div>
      <div className="pet-card-aside">
        <img src={petImage} alt={petName} className="pet-card-pet-img" />
        <div className="pet-card-actions">
          <button className="btn btn-primary">Ver Detalles</button>
        </div>
      </div>
    </div>
  );
};

export default PetAdoptionCard;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface InstitutionPetCardProps {
  publication: any;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
  showActions?: boolean;
}

const InstitutionPetCard: React.FC<InstitutionPetCardProps> = ({ 
  publication, 
  onDelete, 
  onEdit,
  showActions = false 
}) => {
  const navigate = useNavigate();
  const { post, pet, creator } = publication;
  const [imageError, setImageError] = useState(false);

  // Formatear edad correctamente
  const formatAge = (years: number, months: number): string => {
    if (years === 0 && months === 0) return 'Recién nacido';
    if (years === 0) return `${months} ${months === 1 ? 'mes' : 'meses'}`;
    if (months === 0) return `${years} ${years === 1 ? 'año' : 'años'}`;
    return `${years} ${years === 1 ? 'año' : 'años'}, ${months} ${months === 1 ? 'mes' : 'meses'}`;
  };

  const age = formatAge(pet.age_years || 0, pet.age_months || 0);

  // Traducir valores
  const translateSize = (size: string) => {
    const translations: Record<string, string> = {
      'small': 'Pequeño',
      'medium': 'Mediano',
      'large': 'Grande',
      'extra_large': 'Extra Grande'
    };
    return translations[size] || size;
  };

  const translateSpecies = (species: string) => {
    const translations: Record<string, string> = {
      'dog': 'Perro',
      'cat': 'Gato',
      'bird': 'Ave',
      'rabbit': 'Conejo',
      'other': 'Otro'
    };
    return translations[species] || species;
  };

  const imageUrl = React.useMemo(() => {
    if (imageError) return 'https://via.placeholder.com/300x300?text=Sin+Imagen';
    const url = pet.images?.[0];
    
    if (url && url.includes('ayunpet-api')) {
      return `https://corsproxy.io/?${encodeURIComponent(url)}`;
    }
    return url || 'https://via.placeholder.com/300x300?text=Sin+Imagen';
  }, [pet.images, imageError]);

  const handleViewDetails = () => {
    navigate(`/pet/${post.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && window.confirm(`¿Estás seguro de eliminar "${pet.name}"?`)) {
      onDelete(post.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(post.id);
    }
  };

  return (
    <div className="pet-card">
      <div className="pet-card-content">
        <div>
          <h3>{pet.name || 'Sin nombre'}</h3>
          <div className="pet-details-container">
            <span className="pet-detail-item">{translateSpecies(pet.species)}</span>
            <span className="pet-detail-item">{age}</span>
            <span className="pet-detail-item">{translateSize(pet.size)}</span>
          </div>
        </div>
        <p className="pet-card-description">{post.description}</p>
        <div className="pet-card-footer">
          <div className="pet-card-tags">
            {pet.sterilized && (
              <span className="pet-tag sterilized">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Esterilizado
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
          onError={() => setImageError(true)}
        />
        <div className="card-spacer"></div>
        <div className="pet-card-actions">
          {/* Botones de administración - Si showActions es true */}
          {showActions ? (
            <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', width: '100%' }}>
              <button 
                className="btn"
                onClick={handleEdit}
                style={{
                  width: '100%',
                  backgroundColor: '#4CAF50',
                  color: 'white'
                }}
              >
                ✏️ Editar
              </button>
              <button 
                className="btn"
                onClick={handleDelete}
                style={{
                  width: '100%',
                  backgroundColor: '#f44336',
                  color: 'white'
                }}
              >
                🗑️ Eliminar
              </button>
            </div>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={handleViewDetails}
            >
              Ver Detalles
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstitutionPetCard;

import React, { useState } from 'react';

type RequestStatusCardProps = {
  petName: string; 
  petImage: string; 
  rating: number; 
  description: string;
  submitterName: string; 
  submitterAvatar: string; 
  date: string;
  status: 'en_espera' | 'aceptado' | 'rechazado';
  onInfoClick: () => void;
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="star-rating">
    {[...Array(5)].map((_, index) => (
      <svg key={index} className={index < rating ? 'star-filled' : 'star-empty'} fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
      </svg>
    ))}
  </div>
);

const StatusBadge: React.FC<{ status: RequestStatusCardProps['status'] }> = ({ status }) => {
  const statusClasses = { en_espera: 'status-espera', aceptado: 'status-aceptado', rechazado: 'status-rechazado' };
  const statusText = { en_espera: 'En espera...', aceptado: 'Aceptado', rechazado: 'Rechazado' };
  return <span className={`status-badge ${statusClasses[status]}`}>{statusText[status]}</span>;
};

type ModalProps = Omit<RequestStatusCardProps, 'onInfoClick'> & {
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  isInstitution?: boolean;
};

export const RequestDetailModal: React.FC<ModalProps> = ({
  onClose,
  petName,
  petImage,
  rating,
  description,
  submitterName,
  submitterAvatar,
  date,
  status,
  onApprove,
  onReject,
  isInstitution
}) => {

  const handleViewForm = () => {
    console.log("Clic en Ver formulario");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        <img src={petImage} alt={petName} className="modal-pet-image" />
        
        <div className="modal-body">
          <h3>{petName}</h3>
          <StarRating rating={rating} />
          <p className="modal-description">{description}</p>
          
          <div className="request-card-submitter modal-submitter">
            <img src={submitterAvatar} alt={submitterName} />
            <div>
              <p className="request-card-submitter-name">{submitterName}</p>
              <p className="request-card-submitter-date">{date}</p>
            </div>
          </div>
          
          <StatusBadge status={status} />

          {isInstitution && status === 'en_espera' && (
            <button 
              className="btn btn-primary"
              onClick={handleViewForm}
              style={{ width: '100%', marginTop: '20px' }}
            >
              Ver formulario
            </button>
          )}
        </div>
        
        {isInstitution && status === 'en_espera' && (
          <div className="modal-actions">
            <button className="btn btn-reject" onClick={onReject}>
              Rechazar
            </button>
            <button className="btn btn-approve" onClick={onApprove}>
              Aprobar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function RequestStatusCard({ 
  petName, 
  petImage, 
  rating, 
  description, 
  submitterName, 
  submitterAvatar, 
  date, 
  status,
  onInfoClick 
}: RequestStatusCardProps) {
  
  return (
    <div className="request-card">
      <div className="request-card-content">
        <StarRating rating={rating} />
        <h3>{petName}</h3>
        <p className="request-card-description">{description}</p>
        <div className="request-card-submitter">
          <img src={submitterAvatar} alt={submitterName} />
          <div>
            <p className="request-card-submitter-name">{submitterName}</p>
            <p className="request-card-submitter-date">{date}</p>
          </div>
        </div>
      </div>
      <div className="request-card-aside">
        <img src={petImage} alt={petName} className="request-card-pet-img" />
        <div className="request-card-actions">
          <button className="btn btn-secondary" onClick={onInfoClick}>
            Informacion
          </button>
          <StatusBadge status={status} />
        </div>
      </div>
    </div>
  );
}
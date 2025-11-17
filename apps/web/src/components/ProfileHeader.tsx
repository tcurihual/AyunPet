import React, { useState } from 'react';
import ImageUploadModal from './ImageUploadModal';
import { updateInstitutionProfile } from '../lib/institutionService';

interface ProfileHeaderProps {
  name: string;
  avatar?: string;
  handle?: string;
  description?: string;
  mural?: string;
  isEditable?: boolean;
  token?: string;
  onImageUpdated?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  avatar = '/images/avatars/miguel.jpeg',
  handle = '',
  description = '',
  mural,
  isEditable = false,
  token = '',
  onImageUpdated
}) => {
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [muralModalOpen, setMuralModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (imageBase64: string, type: 'profile' | 'mural') => {
    if (!token) {
      alert('Token de autenticación no disponible');
      return;
    }

    try {
      setLoading(true);
      const updates = {
        [type === 'profile' ? 'profile_picture' : 'profile_mural']: imageBase64
      };

      const response = await updateInstitutionProfile(updates, token);

      if (response.ok) {
        alert(`${type === 'profile' ? 'Foto de perfil' : 'Mural'} actualizado exitosamente`);
        onImageUpdated?.();
      } else {
        alert(`Error al actualizar: ${response.error}`);
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Mural/Banner Section */}
      <div className="profile-header">
        {mural && (
          <div className="profile-mural" style={{ backgroundImage: `url(${mural})` }}>
            {isEditable && (
              <button
                className="edit-mural-btn"
                onClick={() => setMuralModalOpen(true)}
                disabled={loading}
                title="Editar banner"
              >
                📸 Editar banner
              </button>
            )}
          </div>
        )}

        {/* Profile Info Section */}
        <div className="profile-info">
          <div className="profile-avatar-section">
            <img
              src={avatar}
              alt={`Logo de ${name}`}
              className="profile-avatar"
            />
            {isEditable && (
              <button
                className="edit-avatar-btn"
                onClick={() => setProfileModalOpen(true)}
                disabled={loading}
                title="Editar foto de perfil"
              >
                ✏️
              </button>
            )}
          </div>

          <div className="profile-details">
            <h2>{name}</h2>
            {handle && <span className="profile-handle">{handle}</span>}
            {description && <p>{description}</p>}
          </div>
        </div>
      </div>

      {/* Image Upload Modals */}
      <ImageUploadModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onUpload={handleImageUpload}
        type="profile"
        title="Cambiar foto de perfil"
      />

      <ImageUploadModal
        isOpen={muralModalOpen}
        onClose={() => setMuralModalOpen(false)}
        onUpload={handleImageUpload}
        type="mural"
        title="Cambiar banner"
      />
    </>
  );
};

export default ProfileHeader;

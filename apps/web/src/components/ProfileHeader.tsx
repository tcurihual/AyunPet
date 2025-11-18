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
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  avatar = '/images/avatars/miguel.jpeg',
  handle = '',
  description = '',
  mural,
  isEditable = false,
  token = '',
}) => {
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [muralModalOpen, setMuralModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (
    imageBase64: string,
    type: 'profile' | 'mural'
  ) => {
    if (!token) {
      alert('Token de autenticación no disponible');
      return;
    }

    try {
      setLoading(true);
      const updates = {
        [type === 'profile' ? 'image' : 'mural']: imageBase64            console.log('[ProfileHeader] Sending to API:', updates, 'Token:', token);
      const response = await updateInstitutionProfile(updates, token);
            console.log('[ProfileHeader] Response from API:', response);

      if (response.ok) {
        alert(
          `${
            type === 'profile' ? 'Foto de perfil' : 'Mural'
          } actualizado exitosamente! Recargando página...`
        );
        // Recargar la página después de 1 segundo para ver los cambios
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        // Manejo de errores específicos
        const errorMsg = response.error || 'Error desconocido';
        if (
          errorMsg.includes('500') ||
          errorMsg.includes('Internal') ||
          errorMsg.includes('Error')
        ) {
          alert(
            'Error del servidor. Por favor intenta con una imagen más pequeña o de menor resolución.'
          );
          console.error('Server error:', errorMsg);
        } else {
          alert(`Error al actualizar: ${errorMsg}`);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error: ${message}`);
      console.error('Upload error:', error);
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

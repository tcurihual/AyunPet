import React, { useState } from 'react';

const API_BASE_URL = 'http://ayunpet-api.eastus2.cloudapp.azure.com/v1';

interface UploadProfileImagesProps {
  currentProfilePicture?: string;
  currentMural?: string;
  onSuccess?: () => void;
}

const UploadProfileImages: React.FC<UploadProfileImagesProps> = ({ 
  currentProfilePicture, 
  currentMural,
  onSuccess 
}) => {
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [muralPreview, setMuralPreview] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [muralFile, setMuralFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        alert('❌ Solo se permiten imágenes JPG o PNG');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('❌ La imagen no debe superar 5MB');
        return;
      }
      
      setProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMuralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        alert('❌ Solo se permiten imágenes JPG o PNG');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('❌ La imagen no debe superar 10MB');
        return;
      }
      
      setMuralFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMuralPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!profileFile && !muralFile) {
      alert('❌ Selecciona al menos una imagen para subir');
      return;
    }

    setIsUploading(true);
    const token = localStorage.getItem('authToken');
    
    try {
      const formData = new FormData();
      
      if (profileFile) {
        formData.append('image', profileFile);
      }
      
      if (muralFile) {
        formData.append('mural', muralFile);
      }

      console.log('📤 Subiendo imágenes...');

      const response = await fetch(`${API_BASE_URL}/entities/users/me`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al subir imágenes');
      }

      const result = await response.json();
      console.log('✅ Imágenes actualizadas:', result);
      
      alert('✅ Imágenes actualizadas exitosamente');
      
      setProfileFile(null);
      setMuralFile(null);
      setProfilePreview(null);
      setMuralPreview(null);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('❌ Error al subir:', err);
      alert(`❌ Error: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginTop: '2rem'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>📸 Actualizar Fotos de Perfil</h3>

      {/* Foto de perfil */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
          Foto de Perfil
        </label>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {(profilePreview || currentProfilePicture) && (
            <div style={{ position: 'relative' }}>
              <img
                src={profilePreview || currentProfilePicture}
                alt="Perfil"
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  border: '3px solid #e5e7eb'
                }}
              />
              {profilePreview && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem'
                }}>
                  ✓
                </span>
              )}
            </div>
          )}
          
          <div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleProfileChange}
              style={{ display: 'none' }}
              id="profile-upload"
            />
            <label
              htmlFor="profile-upload"
              style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              📁 Seleccionar foto
            </label>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
              JPG o PNG, máx 5MB
            </p>
          </div>
        </div>
      </div>

      {/* Mural */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
          Imagen de Banner/Mural
        </label>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {(muralPreview || currentMural) && (
            <div style={{ position: 'relative' }}>
              <img
                src={muralPreview || currentMural}
                alt="Mural"
                style={{
                  width: '200px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb'
                }}
              />
              {muralPreview && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem'
                }}>
                  ✓
                </span>
              )}
            </div>
          )}
          
          <div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleMuralChange}
              style={{ display: 'none' }}
              id="mural-upload"
            />
            <label
              htmlFor="mural-upload"
              style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              📁 Seleccionar banner
            </label>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
              JPG o PNG, máx 10MB
            </p>
          </div>
        </div>
      </div>

      {/* Botón de guardar */}
      <button
        onClick={handleSubmit}
        disabled={isUploading || (!profileFile && !muralFile)}
        style={{
          width: '100%',
          padding: '0.875rem',
          backgroundColor: isUploading || (!profileFile && !muralFile) ? '#9ca3af' : '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: isUploading || (!profileFile && !muralFile) ? 'not-allowed' : 'pointer'
        }}
      >
        {isUploading ? '⏳ Subiendo...' : '💾 Guardar Cambios'}
      </button>
    </div>
  );
};

export default UploadProfileImages;

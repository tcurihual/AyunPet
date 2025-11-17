import React, { useState, useRef } from 'react';
import { Modal } from './Modal';
import './Modal.css';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (imageBase64: string, type: 'profile' | 'mural') => Promise<void>;
  type: 'profile' | 'mural';
  title: string;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  type,
  title
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo no debe superar 5MB');
      return;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('El archivo debe ser una imagen');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!preview) return;

    try {
      setLoading(true);
      await onUpload(preview, type);
      setPreview(null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleCancel}>
      <div className="image-upload-modal">
        <h2>{title}</h2>
        
        <div className="upload-area">
          {preview ? (
            <img src={preview} alt="Vista previa" className="preview-image" />
          ) : (
            <div className="upload-placeholder" onClick={() => fileInputRef.current?.click()}>
              <p>Click para seleccionar una imagen o arrastra aquí</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="modal-actions">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="btn-secondary"
          >
            {preview ? 'Cambiar imagen' : 'Seleccionar imagen'}
          </button>
          <button
            onClick={handleUpload}
            disabled={!preview || loading}
            className="btn-primary"
          >
            {loading ? 'Subiendo...' : 'Subir'}
          </button>
          <button onClick={handleCancel} disabled={loading} className="btn-cancel">
            Cancelar
          </button>
        </div>
      </div>
    </Modal>
  );

export default ImageUploadModal;

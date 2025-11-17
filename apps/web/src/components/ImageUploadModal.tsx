import React, { useState, useRef } from 'react';
import Modal from './Modal';
import './ImageUploadModal.css';

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

  // Función para comprimir la imagen
  const compressImage = async (
    base64String: string,
    maxSizeKB: number = 500
  ): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64String;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Reducir tamaño si es muy grande
        const maxDimension = 1200;
        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Comprimir JPEG hasta alcanzar el tamaño máximo
        let quality = 0.8;
        let compressed = canvas.toDataURL('image/jpeg', quality);

        while (compressed.length > maxSizeKB * 1024 && quality > 0.1) {
          quality -= 0.1;
          compressed = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(compressed);
      };
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (máximo 2MB para base64 = ~1.5MB original)
    if (file.size > 2 * 1024 * 1024) {
      setError('El archivo no debe superar 2MB');
      return;
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Solo se permiten imágenes JPEG, PNG o WebP');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      // Validar dimensiones mínimas
      const img = new Image();
      img.onload = () => {
        if (img.width < 400 || img.height < 300) {
          setError('La imagen debe tener al menos 400x300 píxeles');
          return;
        }
        setError(null);
        setPreview(event.target?.result as string);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!preview) return;
    try {
      setLoading(true);
      // Comprimir imagen antes de enviar
      const compressedImage = await compressImage(preview, 500);
      await onUpload(compressedImage, type);
      setPreview(null);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al subir la imagen'
      );
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
            <div
              className="upload-placeholder"
              onClick={() => fileInputRef.current?.click()}
            >
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
};

export default ImageUploadModal;

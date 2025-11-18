// apps/web/src/components/CreateAdoptionRequestModal.tsx
import React, { useState } from 'react';
import { createAdoptionRequest, CreateAdoptionRequestInput } from '../lib/adoptionRequestsService';
import './Modal.css';

interface CreateAdoptionRequestModalProps {
  postId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token: string;
}

const CreateAdoptionRequestModal: React.FC<CreateAdoptionRequestModalProps> = ({
  postId,
  isOpen,
  onClose,
  onSuccess,
  token,
}) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const input: CreateAdoptionRequestInput = {
        post_id: postId,
        message: message.trim(),
      };

      const result = await createAdoptionRequest(token, input);

      if (result.ok) {
        setSuccess(true);
        setMessage('');
        onSuccess();
        setTimeout(() => onClose(), 2000);
      } else {
        setError(result.error || 'Error al crear la solicitud');
      }
    } catch (err: any) {
      setError(err.message || 'Error de red');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Solicitar Adopción</h3>
          <button onClick={onClose} className="modal-close" aria-label="Cerrar">
            ×
          </button>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="adoption-request-form">
            <div className="form-group">
              <label htmlFor="message">¿Por qué te interesa adoptar esta mascota?</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Cuéntanos sobre tu experiencia con mascotas, por qué te interesa esta en particular, y cómo la cuidarás..."
                rows={5}
                maxLength={1000}
                required
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
              <small style={{ color: '#666', fontSize: '12px' }}>
                {message.length}/1000 caracteres
              </small>
            </div>

            {error && (
              <div
                className="error-message"
                style={{
                  padding: '12px',
                  backgroundColor: '#fee',
                  color: '#c33',
                  borderRadius: '8px',
                  marginTop: '12px',
                }}
              >
                {error}
              </div>
            )}

            <div className="modal-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="btn-secondary"
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: '#e0e0e0',
                  color: '#333',
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="btn-primary"
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isSubmitting || !message.trim() ? 'not-allowed' : 'pointer',
                  backgroundColor: isSubmitting || !message.trim() ? '#ccc' : '#ff6b6b',
                  color: 'white',
                }}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
            </div>
          </form>
        ) : (
          <div className="success-message" style={{ textAlign: 'center', padding: '24px' }}>
            <div className="success-icon" style={{ fontSize: '48px', marginBottom: '16px' }}>
              ✅
            </div>
            <p style={{ color: '#2ecc71', fontSize: '1.1rem', margin: 0 }}>
              Solicitud enviada exitosamente. El publicante la revisará pronto.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateAdoptionRequestModal;

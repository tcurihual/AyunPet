import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPasswordService } from '../lib/authService';
import './css/ForgotPasswordPage.css';

interface ForgotPasswordPageProps {
  // Props opcionales para testing
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ 
  onSuccess, 
  onError 
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      const errorMsg = 'Por favor ingresa tu email';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    if (!isValidEmail(email)) {
      const errorMsg = 'Por favor ingresa un email válido';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await forgotPasswordService(email);
      
      if (response.success) {
        setIsSuccess(true);
        setMessage('Se ha enviado un enlace de recuperación a tu email. Revisa tu bandeja de entrada y spam.');
        onSuccess?.();
      } else {
        throw new Error(response.error || 'Error al enviar el email de recuperación');
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Error al enviar el email de recuperación. Intenta nuevamente.';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h1>Recuperar Contraseña</h1>
          <p>Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña</p>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu-email@ejemplo.com"
                disabled={isLoading}
                className={error ? 'error' : ''}
                data-testid="email-input"
              />
            </div>

            {error && (
              <div className="error-message" data-testid="error-message">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="submit-button"
              data-testid="submit-button"
            >
              {isLoading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
            </button>
          </form>
        ) : (
          <div className="success-container">
            <div className="success-message" data-testid="success-message">
              {message}
            </div>
            <button 
              onClick={handleBackToLogin}
              className="back-button"
              data-testid="back-to-login-button"
            >
              Volver al Login
            </button>
          </div>
        )}

        <div className="forgot-password-footer">
          <Link to="/login" className="back-link">
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
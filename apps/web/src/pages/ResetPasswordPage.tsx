import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { resetPasswordService, isValidPassword } from '../lib/authService';
import '../styles/ResetPasswordPage.css';

interface ResetPasswordPageProps {
  // Props opcionales para testing
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ 
  onSuccess, 
  onError 
}) => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    } else {
      setError('Token de recuperación no encontrado. Solicita un nuevo enlace de recuperación.');
    }
  }, [searchParams]);

  const validatePassword = (password: string) => {
    const validation = isValidPassword(password);
    setPasswordErrors(validation.errors);
    return validation.valid;
  };

  const handlePasswordChange = (password: string) => {
    setNewPassword(password);
    if (password) {
      validatePassword(password);
    } else {
      setPasswordErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      const errorMsg = 'Token de recuperación no válido';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    if (!newPassword || !confirmPassword) {
      const errorMsg = 'Por favor completa todos los campos';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    if (newPassword !== confirmPassword) {
      const errorMsg = 'Las contraseñas no coinciden';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    if (!validatePassword(newPassword)) {
      const errorMsg = 'La contraseña no cumple con los requisitos de seguridad';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await resetPasswordService(token, newPassword, confirmPassword);
      
      if (response.success) {
        setIsSuccess(true);
        onSuccess?.();
      } else {
        throw new Error(response.error || 'Error al restablecer la contraseña');
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Error al restablecer la contraseña. Intenta nuevamente.';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  if (!token && !error) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="loading-message">Validando token...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <h1>Restablecer Contraseña</h1>
          <p>Ingresa tu nueva contraseña para completar la recuperación</p>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="reset-password-form">
            <div className="form-group">
              <label htmlFor="newPassword">Nueva Contraseña</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="Ingresa tu nueva contraseña"
                disabled={isLoading}
                className={passwordErrors.length > 0 ? 'error' : ''}
                data-testid="new-password-input"
              />
              {passwordErrors.length > 0 && (
                <div className="password-requirements">
                  <p className="requirements-title">Requisitos de contraseña:</p>
                  <ul className="requirements-list">
                    <li className={newPassword.length >= 6 ? 'valid' : 'invalid'}>
                      Al menos 6 caracteres
                    </li>
                    <li className={/[a-z]/.test(newPassword) ? 'valid' : 'invalid'}>
                      Una letra minúscula
                    </li>
                    <li className={/[A-Z]/.test(newPassword) ? 'valid' : 'invalid'}>
                      Una letra mayúscula
                    </li>
                    <li className={/\d/.test(newPassword) ? 'valid' : 'invalid'}>
                      Un número
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu nueva contraseña"
                disabled={isLoading}
                className={confirmPassword && newPassword !== confirmPassword ? 'error' : ''}
                data-testid="confirm-password-input"
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <div className="field-error">Las contraseñas no coinciden</div>
              )}
            </div>

            {error && (
              <div className="error-message" data-testid="error-message">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading || passwordErrors.length > 0 || !token}
              className="submit-button"
              data-testid="submit-button"
            >
              {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
            </button>
          </form>
        ) : (
          <div className="success-container">
            <div className="success-message" data-testid="success-message">
              Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
            </div>
            <button 
              onClick={handleLoginRedirect}
              className="login-button"
              data-testid="login-button"
            >
              Ir al Login
            </button>
          </div>
        )}

        <div className="reset-password-footer">
          <Link to="/login" className="back-link">
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
import React, { useState } from 'react';
import logo from '../assets/logo.png';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { useLoading } from '../context/LoadingContext';

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isLoading, setLoading } = useLoading();
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordData) => {
    if (!token) {
      setError('root', { message: 'Token inválido o expirado' });
      return;
    }

    setLoading(true);
    try {
      console.log('Restableciendo contraseña con token:', token);
      console.log('Nueva contraseña:', data.password);

      await new Promise(resolve => setTimeout(resolve, 1500));

      setResetSuccess(true);

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      setError('root', { message: 'Error al restablecer la contraseña. Intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="login-card">
        <img src={logo} alt="Logo Ayün Pet" className="login-logo" />
        <h2>Error</h2>
        <p className="error-message">El enlace de restablecimiento es inválido o ha expirado.</p>
        <Link to="/login" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
          Volver al inicio de sesión
        </Link>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="login-card">
        <img src={logo} alt="Logo Ayün Pet" className="login-logo" />
        <h2>¡Contraseña actualizada!</h2>
        <p className="login-subtitle" style={{ color: '#4caf50' }}>
          Tu contraseña ha sido restablecida exitosamente.
          <br />
          Serás redirigido al inicio de sesión...
        </p>
      </div>
    );
  }

  return (
    <div className="login-card">
      <img src={logo} alt="Logo Ayün Pet" className="login-logo" />
      <h2>Restablecer contraseña</h2>
      <p className="login-subtitle">Ingresa tu nueva contraseña</p>
      
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {errors.root && <p className="error-message">{errors.root.message}</p>}

        <div className="form-group">
          <label htmlFor="password">Nueva contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            {...register('password')}
            disabled={isLoading}
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="••••••••"
            {...register('confirmPassword')}
            disabled={isLoading}
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
        </div>
        
        <button type="submit" className="btn btn-submit" disabled={isLoading}>
          {isLoading ? 'Restableciendo...' : 'Restablecer contraseña'}
        </button>
      </form>
      
      <p className="create-account-link">
        ¿Recordaste tu contraseña?{' '}
        <Link to="/login">Iniciar sesión</Link>
      </p>
    </div>
  );
};

export default ResetPasswordForm;
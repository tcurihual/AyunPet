import React from 'react';
import logo from '../assets/logo.png';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema, type LoginData } from '../lib/schemas';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isLoading } = useLoading();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    try {
      await login(data);
      navigate('/');
    } catch (error: any) {
      // Mostrar mensaje de error real del backend (401 o 404)
      const message =
        error.message ||
        'Ocurrió un error inesperado al intentar iniciar sesión.';
      setError('root', { message });
    }
  };

  return (
    <div className="login-card">
      <img src={logo} alt="Logo Ayün Pet" className="login-logo" />
      <h2>Iniciar sesión</h2>
      <p className="login-subtitle">Bienvenido a Ayün Pet</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Mensaje general de error */}
        {errors.root && (
          <p className="error-message">{errors.root.message}</p>
        )}

        {/* Campo de correo */}
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            placeholder="ejemplo@correo.com"
            {...register('email')}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
        </div>

        {/* Campo de contraseña */}
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="********"
            {...register('password')}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
          <Link
            to="/forgot-password"
            style={{
              fontSize: '14px',
              color: '#8c6e4a',
              textDecoration: 'none',
            }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Botón de envío */}
        <button type="submit" className="btn btn-submit" disabled={isLoading}>
          {isLoading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      {/* Enlace de registro */}
      <p className="create-account-link">
        ¿No tienes cuenta? <Link to="/register">Crear cuenta</Link>
      </p>
    </div>
  );
};

export default LoginForm;

import React from 'react';
import logo from '../assets/logo.png';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterData } from '../lib/schemas';
import { useLoading } from '../context/LoadingContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const { isLoading } = useLoading();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { userType: '' },
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      console.log('[REGISTRO] Enviando datos:', data);
      
      await registerUser(data);
      
      console.log('[REGISTRO] Registro completado exitosamente');
      
      // Éxito: mostrar mensaje y limpiar formulario
      alert('¡Registro exitoso! Se ha enviado un correo de bienvenida a tu dirección de email.');
      reset();
      
      // Opcionalmente redirigir al login
      // navigate('/login');
      
    } catch (error: any) {
      console.error('[REGISTRO] Error:', error?.message || error);
      
      // Mostrar mensaje de error real del backend (similar al LoginForm)
      const message = error?.message || 'Ocurrió un error inesperado al registrarse.';
      setError('root', { message });
    }
  };

  return (
    <div className="form-card">
      <img src={logo} alt="Logo Ayün Pet" className="form-logo" />
      <h2>Crea tu cuenta</h2>
      <p className="form-subtitle">Únete a Ayün Pet</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Mensaje general de error */}
        {errors.root && (
          <p className="error-message">{errors.root.message}</p>
        )}

        <div className="form-group">
          <label htmlFor="fullName">Nombre completo</label>
          <input 
            id="fullName" 
            placeholder="Ej: Sofía González Pérez" 
            {...register('fullName')} 
            disabled={isLoading} 
          />
          {errors.fullName && <p className="error-message">{errors.fullName.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input 
            id="email" 
            type="email" 
            placeholder="sofia@email.com" 
            {...register('email')} 
            disabled={isLoading} 
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="rut">RUT</label>
          <input 
            id="rut" 
            placeholder="12.345.678-9" 
            {...register('rut')} 
            disabled={isLoading} 
          />
          {errors.rut && <p className="error-message">{errors.rut.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input 
            id="password" 
            type="password" 
            placeholder="••••••••" 
            {...register('password')} 
            disabled={isLoading} 
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <input 
            id="confirmPassword" 
            type="password" 
            placeholder="••••••••" 
            {...register('confirmPassword')} 
            disabled={isLoading} 
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="address">Dirección (opcional)</label>
          <input 
            id="address" 
            placeholder="Av. Ejemplo 123, Ciudad" 
            {...register('address')} 
            disabled={isLoading} 
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción (opcional)</label>
          <input 
            id="description" 
            placeholder="Breve descripción sobre ti..." 
            {...register('description')} 
            disabled={isLoading} 
          />
          {errors.description && <p className="error-message">{errors.description.message}</p>}
        </div>

        <div className="terms-group">
          <input 
            type="checkbox" 
            {...register('agreedToTerms')} 
            disabled={isLoading} 
          />
          <label>
            Acepto los <a href="#">términos y condiciones</a> y la <a href="#">política de privacidad</a>.
          </label>
        </div>
        {errors.agreedToTerms && <p className="error-message terms-error">{errors.agreedToTerms.message}</p>}

        <button type="submit" className="btn btn-submit" disabled={isLoading}>
          {isLoading ? 'Registrando...' : '🚀 Registrarse'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
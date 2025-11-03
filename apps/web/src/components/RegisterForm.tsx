import React from 'react';
import logo from '../assets/logo.png';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterData } from '../lib/schemas';
import { useLoading } from '../context/LoadingContext';
import { useAuth } from '../context/AuthContext';

const RegisterForm: React.FC = () => {
  const { isLoading, setLoading } = useLoading();
  const { register: registerUser, login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { userType: '' },
  });

  const onSubmit = async (data: RegisterData) => {
    console.log('[REGISTRO] Enviando datos:', data);
    setLoading(true);
    try {
      // 1) Llamamos a register igual que login (misma estructura de manejo)
      const payload = { ...data };
      await registerUser(payload as any);
      console.log('[REGISTRO] Registro completado, sin auto login');

      // 2) Feedback uniforme al de login
      alert('Registro exitoso. Revisa tu correo para validar tu cuenta.');

      // 3) Limpieza de formulario
      reset();
    } catch (error: any) {
      console.error('[REGISTRO] Error:', error?.message || error);
      alert(`Error en el registro: ${error?.message || 'intenta nuevamente'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <img src={logo} alt="Logo Ayün Pet" className="form-logo" />
      <h2>Crea tu cuenta</h2>
      <p className="form-subtitle">Únete a Ayün Pet</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-group">
          <label htmlFor="fullName">Nombre completo</label>
          <input id="fullName" placeholder="Ej: Sofía González Pérez" {...register('fullName')} disabled={isLoading} />
          {errors.fullName && <p className="error-message">{errors.fullName.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input id="email" type="email" placeholder="sofia@email.com" {...register('email')} disabled={isLoading} />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="rut">RUT</label>
          <input id="rut" placeholder="12.345.678-9" {...register('rut')} disabled={isLoading} />
          {errors.rut && <p className="error-message">{errors.rut.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" placeholder="••••••••" {...register('password')} disabled={isLoading} />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <input id="confirmPassword" type="password" placeholder="••••••••" {...register('confirmPassword')} disabled={isLoading} />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="address">Dirección (opcional)</label>
          <input id="address" {...register('address')} disabled={isLoading} />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción (opcional)</label>
          <input id="description" {...register('description')} disabled={isLoading} />
          {errors.description && <p className="error-message">{errors.description.message}</p>}
        </div>

        <div className="terms-group">
          <input type="checkbox" {...register('agreedToTerms')} disabled={isLoading} />
          <label>Acepto los <a href="#">términos y condiciones</a> y la <a href="#">política de privacidad</a>.</label>
        </div>
        {errors.agreedToTerms && <p className="error-message terms-error">{errors.agreedToTerms.message}</p>}

        <button type="submit" className="btn btn-submit" disabled={isLoading}>
          {isLoading ? '⏳ Registrando...' : '🚀 Registrarse'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;

import React from 'react';
import logo from '../assets/logo.png';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterData } from '../lib/schemas';
import { useLoading } from '../context/LoadingContext';
import { useAuth } from '../context/AuthContext';

const RegisterForm: React.FC = () => {
  const { isLoading, setLoading } = useLoading();
  const { register: registerUser } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { userType: '' }
  });

  const onSubmit = async (data: RegisterData) => {
    setLoading(true);
    try {
      await registerUser(data);
      alert('Registro exitoso');
    } catch (error) {
      console.error(error);
      alert('Error en el registro');
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
          <input {...register('fullName')} placeholder="Ej: Sofía González Pérez" disabled={isLoading} />
          {errors.fullName && <p className="error-message">{errors.fullName.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input {...register('email')} placeholder="sofia.gonzalez@email.com" disabled={isLoading} />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="rut">RUT</label>
          <input {...register('rut')} placeholder="12.345.678-9" disabled={isLoading} />
          {errors.rut && <p className="error-message">{errors.rut.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input type="password" {...register('password')} placeholder="••••••••" disabled={isLoading} />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <input type="password" {...register('confirmPassword')} placeholder="••••••••" disabled={isLoading} />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="userType">Tipo de cuenta</label>
          <select {...register('userType')} disabled={isLoading} className="form-select">
            <option value="">Selecciona una opción...</option>
            <option value="usuario">Usuario</option>
            <option value="empresa">Empresa</option>
          </select>
          {errors.userType && <p className="error-message">{errors.userType.message}</p>}
        </div>

        <div className="terms-group">
          <input type="checkbox" {...register('agreedToTerms')} disabled={isLoading} />
          <label>Acepto los <a href="#">términos y condiciones</a> y la <a href="#">política de privacidad</a>.</label>
        </div>
        {errors.agreedToTerms && <p className="error-message terms-error">{errors.agreedToTerms.message}</p>}

        <button type="submit" className="btn btn-submit" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;

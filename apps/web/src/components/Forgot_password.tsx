import React, { useState } from 'react';
import logo from '../assets/logo.png';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useLoading } from '../context/LoadingContext';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Ingresa un correo electrónico válido'),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm: React.FC = () => {
  const { isLoading, setLoading } = useLoading();
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    setLoading(true);
    try {
      console.log('Enviando email de recuperación a:', data.email);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmittedEmail(data.email);
      setEmailSent(true);
      
    } catch (error) {
      setError('root', { 
        message: 'Error al enviar el correo. Por favor intenta nuevamente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="login-card">
        <img src={logo} alt="Logo Ayün Pet" className="login-logo" />
        <h2>¡Correo enviado!</h2>
        <p className="login-subtitle" style={{ marginBottom: '20px' }}>
          Hemos enviado un enlace de restablecimiento a:
        </p>
        <p style={{ 
          fontWeight: 'bold', 
          color: '#4f4641', 
          marginBottom: '20px',
          fontSize: '16px' 
        }}>
          {submittedEmail}
        </p>
        <p className="login-subtitle" style={{ marginBottom: '30px' }}>
          Por favor revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
        </p>
        <Link to="/login" className="btn btn-primary">
          Volver al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="login-card">
      <img src={logo} alt="Logo Ayün Pet" className="login-logo" />
      <h2>¿Olvidaste tu contraseña?</h2>
      <p className="login-subtitle">
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
      </p>
      
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {errors.root && <p className="error-message">{errors.root.message}</p>}

        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            placeholder="ejemplo@correo.com"
            {...register('email')}
            disabled={isLoading}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>
        
        <button type="submit" className="btn btn-submit" disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
        </button>
      </form>
      
      <p className="create-account-link">
        ¿Recordaste tu contraseña?{' '}
        <Link to="/login">Iniciar sesión</Link>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;
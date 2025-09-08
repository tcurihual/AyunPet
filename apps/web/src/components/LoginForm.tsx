import React from 'react';
import logo from '../assets/logo.png';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginData } from '../lib/schemas';

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginData) => {
    console.log("Datos de login validados:", data);
    // aqui va la logica para enviar al backend
  };

  return (
    <div className="login-card">
      <img src={logo} alt="Logo Ayün Pet" className="login-logo" />
      <h2>Iniciar sesión</h2>
      <p className="login-subtitle">Bienvenido a Ayün Pet</p>
      
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            placeholder="ejemplo@correo.com"
            {...register("email")}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="********"
            {...register("password")}
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>
        
        <button type="submit" className="btn btn-submit">Ingresar</button>
      </form>
      
      <p className="create-account-link">
        ¿No tienes cuenta? <a href="/register">Crear cuenta</a>
      </p>
    </div>
  );
};

export default LoginForm;
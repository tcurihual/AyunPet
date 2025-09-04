import React from 'react';
import logo from '../assets/logo.png';
y
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { registerSchema } from '../lib/schemas';

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const { 
    register,         
    handleSubmit,      
    formState: { errors }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormValues) => { // aqui va la logica del submit :v
  };

  return (
    <div className="form-card">
      <img src={logo} alt="Logo Ayün Pet" className="form-logo" />
      <h2>Crea tu cuenta</h2>
      <p className="form-subtitle">Únete a Ayün Pet</p>
      
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        
        <div className="form-group">
          <label htmlFor="fullName">Nombre completo</label>
          <input 
            type="text" 
            id="fullName" 
            placeholder="Ej: Sofía González Pérez" 
            {...register("fullName")} 
          />
          {errors.fullName && <p className="error-message">{errors.fullName.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input 
            type="email" 
            id="email" 
            placeholder="sofia.gonzalez@email.com" 
            {...register("email")}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="rut">RUT</label>
          <input 
            type="text" 
            id="rut" 
            placeholder="12.345.678-9" 
            {...register("rut")}
          />
          {errors.rut && <p className="error-message">{errors.rut.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            placeholder="••••••••" 
            {...register("password")}
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <input 
            type="password" 
            id="confirmPassword" 
            placeholder="••••••••" 
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
        </div>
        
        <div className="terms-group">
          <input 
            type="checkbox" 
            id="agreedToTerms" 
            {...register("agreedToTerms")}
          />
          <label htmlFor="agreedToTerms">
            Acepto los <a href="#">términos y condiciones</a> y la <a href="#">política de privacidad</a>.
          </label>
        </div>
        {errors.agreedToTerms && <p className="error-message terms-error">{errors.agreedToTerms.message}</p>}

        <button type="submit" className="btn btn-submit">Registrarse</button>
      </form>
    </div>
  );
};

export default RegisterForm;
import React from 'react';
import logo from '../assets/logo.png';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterData } from '../lib/schemas';
import { useLoading } from '../context/LoadingContext';

const RegisterForm: React.FC = () => {
  const { isLoading, setLoading } = useLoading();
  const { 
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userType: "",
    },
  });

  const onSubmit = async (data: RegisterData) => {
    setLoading(true);
    try {
      console.log("Datos validados (solo visualización, no se envían a BD):", data);
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Simulación completada.");
    } catch (error) {
      console.error("Error:", error);
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
          <input 
            type="text" 
            id="fullName" 
            placeholder="Ej: Miguel Angel Fernandez Espinoza" 
            {...register("fullName")}
            disabled={isLoading}
          />
          {errors.fullName && <p className="error-message">{errors.fullName.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input 
            type="email" 
            id="email" 
            placeholder="miguel.fernandez2021@alu.uct.cl" 
            {...register("email")}
            disabled={isLoading}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="rut">RUT</label>
          <input 
            type="text" 
            id="rut" 
            placeholder="20.987.300-1" 
            {...register("rut")}
            disabled={isLoading}
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
            {...register("confirmPassword")}
            disabled={isLoading}
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="address">Dirección (opcional)</label>
          <input 
            type="text" 
            id="address" 
            placeholder="Ej: El Sauco 7490480 Praderas Santa Carolina" 
            {...register("address")}
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Descripción (opcional)</label>
          <input 
            type="text" 
            id="description" 
            placeholder="Ej: Amante de los animales y voluntario" 
            {...register("description")}
            disabled={isLoading}
            className="form-input"
          />
          {errors.description && <p className="error-message">{errors.description.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="userType">Tipo de cuenta</label>
          <select 
            id="userType" 
            {...register("userType")}
            disabled={isLoading}
            className="form-select"
          >
            <option value="">Selecciona una opción...</option>
            <option value="usuario">Usuario</option>
            <option value="empresa">Empresa</option>
          </select>
          {errors.userType && <p className="error-message">{errors.userType.message}</p>}
        </div>
        <div className="terms-group">
          <input 
            type="checkbox" 
            id="agreedToTerms" 
            {...register("agreedToTerms")}
            disabled={isLoading}
          />
          <label htmlFor="agreedToTerms">
            Acepto los <a href="#">términos y condiciones</a> y la <a href="#">política de privacidad</a>.
          </label>
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
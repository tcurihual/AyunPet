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
    console.log("Enviando datos validados a la API:", data);

    // Llamada real al endpoint
    const response = await fetch("http://localhost:4000/api/auth/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: data.fullName,
        email: data.email,
        rut: data.rut,
        password: data.password,
      }),
    });

    if (response.ok) {
      // Registro exitoso
      const result = await response.json();
      console.log("Usuario registrado:", result);
      alert("Cuenta creada con éxito");
    } else if (response.status === 409) {
      // RUT o email ya registrado
      const error = await response.json();
      alert(error.error || "El RUT o correo ya está registrado");
    } else {
      const error = await response.json();
      throw new Error(error.error || "Error desconocido al registrar usuario");
    }

  } catch (error: any) {
    console.error("Error al registrar el usuario:", error);
    alert("Hubo un error al crear la cuenta. Por favor, inténtalo de nuevo.");
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
            placeholder="Ej: Sofía González Pérez" 
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
            placeholder="sofia.gonzalez@email.com" 
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
            placeholder="12.345.678-9" 
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
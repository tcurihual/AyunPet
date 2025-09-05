import React, { useState } from 'react';
import logo from '../assets/logo.png';
const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => { //aqui esta la funcion del login :v
  };

  return (
    <div className="login-card">
      <img src={logo} alt="Logo Ayün Pet" className="login-logo" />
      <h2>Iniciar sesión</h2>
      <p className="login-subtitle">Bienvenido a Ayün Pet</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
          />
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
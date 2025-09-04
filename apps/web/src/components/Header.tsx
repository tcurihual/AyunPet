
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Header: React.FC = () => {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Logo Ayün Pet" className="logo" />
        </Link>
        <nav>
          <ul>
            <li><a href="#">Adopta</a></li>
            <li><a href="#">Refugios y Organizaciones</a></li>
            <li><a href="#">Nosotros</a></li>
          </ul>
        </nav>
      </div>
      <div className="navbar-right">
        <Link to="/login" className="btn btn-secondary">
          Iniciar Sesión
        </Link>
        <Link to="/register" className="btn btn-primary">
          Registrarse
        </Link>
      </div>
    </header>
  );
};

export default Header;
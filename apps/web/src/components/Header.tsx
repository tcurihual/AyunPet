import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);
  
  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Logo Ayün Pet" className="logo" />
        </Link>
        <nav>
          <ul>
            <li><Link to="/adopta">Adopta</Link></li>
            <li><Link to="/refugios">Refugios y Organizaciones</Link></li>
            <li><Link to="/noticias">Noticias</Link></li>
            <li><Link to="/nosotros">Nosotros</Link></li>
          </ul>
        </nav>
      </div>
      <div className="navbar-right">
        {user ? (
          <div className="profile-menu-container" ref={menuRef}>
            <button 
              className="profile-button" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
            {isMenuOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  Bienvenido de vuelta
                  <strong>{user.name}</strong>
              </div>
              
              {(user.role === 'institution' || user.role === 'tester') && (
                 <Link to="/muro-institucion" className="dropdown-item">Muro de Institución</Link>
              )}
              
              {(user.role === 'normal' || user.role === 'tester') && (
                <Link to="/perfil" className="dropdown-item">Mi Perfil</Link>
              )}

              <Link to="/solicitudes" className="dropdown-item">Mis Solicitudes</Link>
              <button onClick={handleLogout} className="dropdown-item logout-button">
                Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="btn btn-primary">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
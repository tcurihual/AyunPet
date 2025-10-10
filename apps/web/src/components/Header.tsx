import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
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

  const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
  );

  const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
  );

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
            <li><Link to="/nosotros">Nosotros</Link></li>
          </ul>
        </nav>
      </div>
      <div className="navbar-right">
        {user ? (
          <div className="user-controls">
            <button onClick={toggleTheme} className="theme-toggle-btn">
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
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
          </div>
        ) : (
          <>
            <button onClick={toggleTheme} className="theme-toggle-btn">
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
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

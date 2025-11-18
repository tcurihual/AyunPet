import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Reduje un poco el tamaño de los iconos (de 24 a 18) para que se vean mejor en la lista
  const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
  );

  const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
  );

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

  // Estilos específicos para que el botón se alinee correctamente
  const toggleButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // Separa el texto del icono
    background: 'transparent', // Quita el fondo gris por defecto de los botones
    border: 'none', // Quita el borde por defecto
    width: '100%',
    cursor: 'pointer',
    fontFamily: 'inherit', // Hereda la fuente Poppins
    fontSize: 'inherit'
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

                <Link to="/solicitudes" className="dropdown-item">
                  {user.role === 'institution' ? 'Ver Solicitudes' : 'Mis Solicitudes'}
                </Link>

                {/* --- AQUÍ ESTÁ LA CORRECCIÓN --- */}
                <button 
                  onClick={toggleTheme} 
                  className="dropdown-item" // Usamos la misma clase que los Links
                  style={toggleButtonStyle} // Estilos extra para resetear botón y acomodar icono
                  aria-label="Cambiar tema"
                >
                  <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>
                  {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                </button>
                {/* ------------------------------- */}

                <button onClick={handleLogout} className="dropdown-item logout-button" style={{...toggleButtonStyle, justifyContent: 'flex-start'}}>
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
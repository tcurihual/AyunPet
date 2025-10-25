import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useTheme } from '../context/ThemeContext';

const Footer: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
  );

  const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
  );

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-column footer-logo-info">
          <img src={logo} alt="Logo Ayün Pet" className="footer-brand-logo" />
          <address>
            1234 Dirección Falsa<br />
            Calle Los Perritos 4321
          </address>
        </div>
        <div className="footer-column footer-contact">
          <a href="tel:+569112345678">(+56) 11234 5678</a>
          <a href="mailto:ayunpet@alu.uct.cl">ayunpet@alu.uct.cl</a>
        </div>
        <div className="footer-column footer-nav">
          <Link to="#">Acerca de nosotros</Link>
          <Link to="#">Facebook</Link>
          <Link to="#">Instagram</Link>
          <Link to="#">Twitter</Link>
          <Link to="#">Contacto</Link>
        </div>
        <div className="footer-column footer-legal">
          <Link to="#">LinkedIn</Link>
          <Link to="#">Términos y Condiciones</Link>
          <p className="footer-copyright">
            © 2025 Beta Academy. Todos los derechos reservados.
          </p>
        </div>
        <div className="footer-column footer-back-to-top">
          <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Cambiar tema">
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button onClick={scrollToTop} className="back-to-top-btn" aria-label="Volver arriba">
            ↑
          </button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
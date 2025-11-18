import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';


const Footer: React.FC = () => {
  

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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
          <button onClick={scrollToTop} className="back-to-top-btn" aria-label="Volver arriba">
            ↑
          </button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
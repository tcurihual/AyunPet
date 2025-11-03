import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import logo from '../assets/logo.png';

const MaintenancePage: React.FC = () => {
  return (
    <div className="page-container">
      <Header />
      <main className="maintenance-container">
        <div className="maintenance-content">
          <img src={logo} alt="Logo Ayün Pet" className="maintenance-logo" />
          <h1>Estamos en Mantenimiento</h1>
          <p className="maintenance-subtitle">
            Estamos trabajando para mejorar tu experiencia. Volveremos pronto.
          </p>
          <div className="maintenance-progress">
            <div className="progress-bar"></div>
          </div>
          <p className="maintenance-contact">
            ¿Necesitas ayuda? Contáctanos en{' '}
            <a href="mailto:ayunpet@alu.uct.cl">ayunpet@alu.uct.cl</a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MaintenancePage;
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './AboutPage.css';

const AboutPage: React.FC = () => {
  return (
    <div className="page-container">
      <Header />
      <main className="about-page-container">

        <section className="hero-section">
          <h1 className="main-title">Sobre Ayün Pet</h1>
          <p className="hero-subtitle">
            Tu próximo mejor amigo está a un clic de distancia.
          </p>
        </section>

        <section className="mission-vision-grid">
          <div className="card-modern">
            <div className="icon-circle">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2" fill="currentColor"/>
              </svg>
            </div>
            <h2 className="card-title">Nuestra Misión</h2>
            <p className="card-description">
              Facilitar el encuentro entre mascotas en busca de un hogar y familias dispuestas a brindarles amor. 
              Trabajamos para que cada adopción sea un éxito, garantizando transparencia y seguridad en todo el proceso.
            </p>
          </div>

          <div className="card-modern">
            <div className="icon-circle">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h2 className="card-title">Nuestra Visión</h2>
            <p className="card-description">
              Ser la plataforma de referencia en adopción de mascotas, donde cada animal encuentre un hogar y cada familia 
              descubra el compañero perfecto. Aspiramos a un mundo donde ninguna mascota quede sin hogar.
            </p>
          </div>
        </section>

        <section className="values-section">
          <h2 className="section-title-center">Nuestros Valores</h2>
          
          <div className="values-grid-modern">
            <div className="value-card-modern">
              <div className="icon-circle-small">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="value-title-modern">Responsabilidad</h3>
              <p className="value-description-modern">
                Gestionamos adecuadamente las publicaciones y comentarios para garantizar la confianza y seguridad de todos los usuarios.
              </p>
            </div>

            <div className="value-card-modern">
              <div className="icon-circle-small">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <h3 className="value-title-modern">Compromiso</h3>
              <p className="value-description-modern">
                Nos dedicamos a crear conexiones significativas entre mascotas y familias, promoviendo adopciones responsables.
              </p>
            </div>

            <div className="value-card-modern">
              <div className="icon-circle-small">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="value-title-modern">Transparencia</h3>
              <p className="value-description-modern">
                La plataforma pone especial énfasis en la visibilidad de las fundaciones y en la publicación responsable de adopciones.
              </p>
            </div>
          </div>
        </section>

        <section className="impact-section">
          <h2 className="section-title-center">Nuestro Impacto</h2>
          
          <div className="impact-grid">
            <div className="impact-card">
              <img 
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80" 
                alt="Conectando vidas"
                className="impact-image"
              />
              <div className="impact-overlay">
                <h3 className="impact-title">Conectando vidas</h3>
              </div>
            </div>

            <div className="impact-card">
              <img 
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80" 
                alt="Trabajando juntos"
                className="impact-image"
              />
              <div className="impact-overlay">
                <h3 className="impact-title">Trabajando juntos</h3>
              </div>
            </div>

            <div className="impact-card">
              <img 
                src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80" 
                alt="Hogares felices"
                className="impact-image"
              />
              <div className="impact-overlay">
                <h3 className="impact-title">Hogares felices</h3>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-final">
          <h2 className="cta-title">¿Listo para adoptar?</h2>
          <p className="cta-text">
            Miles de mascotas están esperando encontrar un hogar amoroso.
          </p>
          <div className="cta-buttons">
            <a href="/adopta" className="btn-cta-primary">Ver Mascotas en Adopción</a>
            <a href="/register" className="btn-cta-secondary">Crear Cuenta</a>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
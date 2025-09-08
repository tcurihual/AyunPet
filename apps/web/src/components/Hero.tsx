import React from 'react';
const heroImageUrl = 'https://i.redd.it/mllhmwhorrma1.jpg';

const Hero: React.FC = () => {
  const heroStyles = {
    backgroundImage: `url(${heroImageUrl})`,
  };

  return (
    <main className="hero" style={heroStyles}>
      <div className="hero-content">
        <h1>Bienvenido a Ayün Pet</h1>
        <p>Tu próximo mejor amigo está a un clic de distancia.</p>
        <div className="hero-buttons">
          <a href="#" className="btn btn-hero">En Adopción</a>
          <a href="#faq" className="btn btn-hero">Preguntas Frecuentes</a>
        </div>
      </div>
    </main>
  );
};

export default Hero;
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutPage: React.FC = () => {
  return (
    <div className="page-container">
      <Header />
      <main className="about-page-container">
        <h1 className="title-center">Sobre Ayün Pet</h1>
        <p className="about-text">
          Ayün Pet es una plataforma web que conecta fundaciones y particulares que ofrecen mascotas en adopción
          con personas interesadas en adoptarlas. Nuestro objetivo es facilitar un proceso de adopción más ágil, seguro y transparente,
          disponible tanto para web como para dispositivos móviles. 
        </p>
        <p className="about-text">
          La plataforma pone especial énfasis en la visibilidad de las fundaciones y en la publicación responsable de adopciones,
          gestionando adecuadamente las publicaciones y comentarios para garantizar la confianza y seguridad de todos los usuarios.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;

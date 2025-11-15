import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePublications } from '../context/PublicationsContext'; 
import { Publication } from '../context/PublicationsContext'; 
import Header from '../components/Header';
import Footer from '../components/Footer';
import './css/PetDetailPage.css';

// --- Iconos de Título ---
const PawIcon = () => <span className="info-icon">🐾</span>;
const HealthIcon = () => <span className="info-icon">🩺</span>;
const InfoIcon = () => <span className="info-icon">ⓘ</span>;

// --- Icono de Salud (con tu SVG) ---
const HealthCheckIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"  /* Ajustado para el tamaño del tag */
    height="14" /* Ajustado para el tamaño del tag */
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor" /* Hereda el color del texto (verde) */
    strokeWidth="2.5" /* Un poco más grueso para verse bien */
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

// --- Componente PetTag MODIFICADO ---
interface PetTagProps {
  label: string;
  type?: 'default' | 'health' | 'sterilized';
}
const PetTag: React.FC<PetTagProps> = ({ label, type = 'default' }) => (
  <span className={`pet-tag tag-${type}`}>
    {/* Mostrar ícono SOLO si es de tipo salud o esterilizado */}
    {(type === 'health' || type === 'sterilized') && <HealthCheckIcon />}
    {label}
  </span>
);


const PetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { publications, fetchPublications } = usePublications();
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState('');

  // 1. Cargar todas las publicaciones
  useEffect(() => {
    // Si las publicaciones están vacías (ej. recarga de página), búscalas
    if (publications.length === 0) {
      fetchPublications();
    }
  }, [fetchPublications, publications.length]);

  // 2. Encontrar la publicación correcta una vez que carguen
  useEffect(() => {
    if (publications.length > 0 && id) {
      const foundPub = publications.find(p => p.id === id);
      if (foundPub) {
        setPublication(foundPub);
        setActiveImage(foundPub.pet.image); // Imagen principal
      }
      setLoading(false);
    } else if (publications.length === 0 && id) {
      // Si aún no hay publicaciones, sigue cargando
      setLoading(true);
    }
  }, [publications, id]);

  // Función para formatear la edad de meses a una cadena legible
  const formatAge = (months: number): string => {
    if (months < 12) return `${months} Meses`;
    if (months === 12) return '1 Año';
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return `${years} Año${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` y ${remainingMonths} Meses` : ''}`;
  };

  // --- Renderizado de Carga y Error ---
  if (loading) {
    return (
      <div className="page-container">
        <Header />
        <main className="pet-detail-loading">
          <h2>Cargando información de la mascota...</h2>
        </main>
        <Footer />
      </div>
    );
  }

  if (!publication) {
    return (
      <div className="page-container">
        <Header />
        <main className="pet-detail-loading">
          <h2>Mascota no encontrada</h2>
          <p>No pudimos encontrar la publicación que buscas.</p>
          <Link to="/adopta" className="btn btn-primary">Volver al catálogo</Link>
        </main>
        <Footer />
      </div>
    );
  }

  // --- Renderizado de la Página ---
  const { pet, creator } = publication;

  // Creamos las listas de tags basadas en los datos
  const detailTags = [
    pet.species, // <-- AÑADIDO
    pet.breed,
    pet.gender,
    pet.size,
    formatAge(pet.age),
    ...pet.tags,
  ];
  
  const healthTags = [pet.healthStatus];
  if (pet.sterilized) {
    healthTags.push('Esterilizado');
  }

  // Imágenes de galería (simuladas, ya que solo hay una)
  const galleryImages = [
    pet.image,
    'https://cdn.discordapp.com/attachments/673348241269719043/1439045995827564748/cierre-de-una-mano-hombre-acariciando-un-perro-feliz-al-aire-libre-adopcion-mascotas-terapia-animal-compania-y-conceptos-384750970.webp?ex=69191785&is=6917c605&hm=fd1b76472f076b745e27707412db3a4d8ff2ca2136f56192b3954c9e2e85d43a&', 
    'https://cdn.discordapp.com/attachments/673348241269719043/1439045996297584750/Mascotas-078-1.jpg?ex=69191785&is=6917c605&hm=5d160337db38d02a8c318c8691559f43089b47f3e62491517ffd0536cefb4a7f&', 
  ];

  return (
    <div className="page-container">
      <Header />
      <div className="pet-detail-page">
        {/* --- Columna Principal --- */}
        <main className="pet-detail-main">
          {/* Galería de Imágenes */}
          <section className="gallery-container">
            <img src={activeImage} alt={pet.name} className="main-image" />
            <div className="thumbnail-list">
              {galleryImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail ${img === activeImage ? 'active' : ''}`}
                  onClick={() => setActiveImage(img)}
                />
              ))}
            </div>
          </section>

          {/* Sección de Info General */}
          <section className="pet-info-section">
            <div className="info-header">
              <PawIcon />
              <h2 className="info-title">{pet.name}</h2>
            </div>
            <p className="info-subtitle">Publicado por: <strong>{creator.name}</strong></p>
            <div className="tag-container">
              {detailTags.map((tag, i) => (
                <PetTag key={i} label={tag} type="default" />
              ))}
            </div>
          </section>

          {/* Sección de Salud */}
          <section className="pet-info-section">
            <div className="info-header">
              <HealthIcon />
              <h2 className="info-title">Vacunas / Salud</h2>
            </div>
            <div className="tag-container">
              {healthTags.map((tag, i) => (
                <PetTag key={i} label={tag} type={tag.toLowerCase() === 'esterilizado' ? 'sterilized' : 'health'} />
              ))}
            </div>
          </section>

          {/* Sección de Descripción */}
          <section className="pet-info-section">
            <div className="info-header">
              <InfoIcon />
              <h2 className="info-title">Descripción / Más Información</h2>
            </div>
            <div className="pet-description">
              <p>{publication.description}</p>
              <p><strong>💛 Personalidad:</strong></p>
              <p>
                {pet.name} es muy sociable y cariñosa. Se lleva bien con otros perros y con niños.
                Le encanta correr, recibir mimos y aprender cosas nuevas, por lo que sería ideal
                para una familia activa y responsable que quiera una compañera fiel.
              </p>
              <p><strong>🏠 Buscamos para ella:</strong></p>
              <p>
                Un hogar donde la quieran, la cuiden y la integren como parte de la familia.
                Necesita espacio para jugar, paseos diarios y mucha atención.
              </p>
            </div>
          </section>
        </main>

        {/* --- Barra Lateral --- */}
        <aside className="pet-detail-sidebar">
          {/* Widget de Contacto */}
          <div className="sidebar-widget">
            <h3>¿Desea adoptar a {pet.name}?</h3>
            <p className="widget-subtitle">¡Contáctenos!</p>
            <button className="contact-button">Contactar</button>
          </div>

          {/* Widget de Fundación */}
          <div className="sidebar-widget">
            <img 
              src="https://cdn.discordapp.com/attachments/1275917279422578753/1383995677687676979/ChatGPT_Image_15_jun_2025_10_23_08_p.m..png?ex=69188d2a&is=69173baa&hm=92407b3b044045c8ea29cae444030e25e5a930ea485765122a821839356e5bf3&" // Imagen placeholder
              alt={`Logo ${creator.name}`} 
              className="creator-image"
            />
            <button className="creator-button">Ver más de {creator.name}</button>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
};

export default PetDetailPage;
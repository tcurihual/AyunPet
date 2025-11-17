import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePublications } from '../context/PublicationsContext'; 
import { Publication } from '../context/PublicationsContext'; 
import Header from '../components/Header';
import Footer from '../components/Footer';
import CommentsList from '../components/CommentsList';
import './css/PetDetailPage.css';

// --- Iconos de Título ---
const PawIcon = () => <span className="info-icon">🐾</span>;
const HealthIcon = () => <span className="info-icon">🩺</span>;
const InfoIcon = () => <span className="info-icon">ⓘ</span>;

// --- Icono de Salud (con tu SVG) ---
const HealthCheckIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

// --- Componente PetTag ---
interface PetTagProps {
  label: string;
  type?: 'default' | 'health' | 'sterilized';
}
const PetTag: React.FC<PetTagProps> = ({ label, type = 'default' }) => (
  <span className={`pet-tag tag-${type}`}>
    {(type === 'health' || type === 'sterilized') && <HealthCheckIcon />}
    {label}
  </span>
);

// --- Componente Avatar con iniciales ---
const getColorFromName = (name: string): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B739', '#52B788', '#E76F51', '#264653'
  ];
  
  const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[charCodeSum % colors.length];
};

const Avatar: React.FC<{ name: string; size?: number }> = ({ name, size = 40 }) => {
  const initial = (name || 'U')[0].toUpperCase();
  const backgroundColor = getColorFromName(name);
  
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: size * 0.4,
        flexShrink: 0,
      }}
    >
      {initial}
    </div>
  );
};

const PetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { publications, fetchPublications } = usePublications();
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (publications.length === 0) {
      fetchPublications();
    }
  }, [fetchPublications, publications.length]);

  useEffect(() => {
    if (publications.length > 0 && id) {
      const foundPub = publications.find(p => p.id === id);
      if (foundPub) {
        setPublication(foundPub);
        setActiveImage(foundPub.pet.image);
      }
      setLoading(false);
    } else if (publications.length === 0 && id) {
      setLoading(true);
    }
  }, [publications, id]);

  const getProxiedImageUrl = (url: string, hasError: boolean): string => {
    if (hasError) return 'https://via.placeholder.com/400x400?text=Sin+Imagen';
    if (!url) return 'https://via.placeholder.com/400x400?text=Sin+Imagen';
    
    if (url.includes('ayunpet-api')) {
      return `https://corsproxy.io/?${encodeURIComponent(url)}`;
    }
    return url;
  };

  const handleImageError = (imageUrl: string) => {
    console.error('Error al cargar imagen:', imageUrl);
    setImageErrors(prev => ({
      ...prev,
      [imageUrl]: true
    }));
  };

  const formatAge = (months: number): string => {
    if (months < 12) return `${months} Meses`;
    if (months === 12) return '1 Año';
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return `${years} Año${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` y ${remainingMonths} Meses` : ''}`;
  };

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
  const { pet, creator, post } = publication;

  const detailTags = [
    pet.species,
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

  // Imágenes de galería con manejo de CORS
  const galleryImages = [
    pet.image,
    ...(post?.images || []),
    'https://cdn.discordapp.com/attachments/673348241269719043/1439045995827564748/cierre-de-una-mano-hombre-acariciando-un-perro-feliz-al-aire-libre-adopcion-mascotas-terapia-animal-compania-y-conceptos-384750970.webp?ex=69191785&is=6917c605&hm=fd1b76472f076b745e27707412db3a4d8ff2ca2136f56192b3954c9e2e85d43a&', 
    'https://cdn.discordapp.com/attachments/673348241269719043/1439045996297584750/Mascotas-078-1.jpg?ex=69191785&is=6917c605&hm=5d160337db38d02a8c318c8691559f43089b47f3e62491517ffd0536cefb4a7f&', 
  ].filter((img, index, self) => img && self.indexOf(img) === index); // Eliminar duplicados

  const mainImageUrl = getProxiedImageUrl(activeImage, imageErrors[activeImage] || false);

  return (
    <div className="page-container">
      <Header />
      <div className="pet-detail-page">
        {/* --- Columna Principal --- */}
        <main className="pet-detail-main">
          {/* Galería de Imágenes */}
          <section className="gallery-container">
            <img 
              src={mainImageUrl} 
              alt={pet.name} 
              className="main-image"
              onError={() => handleImageError(activeImage)}
            />
            <div className="thumbnail-list">
              {galleryImages.map((img, index) => {
                const thumbnailUrl = getProxiedImageUrl(img, imageErrors[img] || false);
                return (
                  <img
                    key={index}
                    src={thumbnailUrl}
                    alt={`Thumbnail ${index + 1}`}
                    className={`thumbnail ${img === activeImage ? 'active' : ''}`}
                    onClick={() => setActiveImage(img)}
                    onError={() => handleImageError(img)}
                  />
                );
              })}
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

          {/* Sección de comentarios */}
          <section className="pet-info-section" style={{ borderTop: '2px solid #f0f0f0', paddingTop: '2rem' }}>
            <div className="info-header">
              <span style={{ fontSize: '1.3rem' }}>💬</span>
              <h2 className="info-title">Comentarios</h2>
            </div>
            <CommentsList 
              postId={publication.id}
              AvatarComponent={Avatar}
            />
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
              src="https://cdn.discordapp.com/attachments/1275917279422578753/1383995677687676979/ChatGPT_Image_15_jun_2025_10_23_08_p.m..png?ex=69188d2a&is=69173baa&hm=92407b3b044045c8ea29cae444030e25e5a930ea485765122a821839356e5bf3&"
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

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { usePublications } from '../context/PublicationsContext';
import { Publication } from '../context/PublicationsContext';

import Header from '../components/Header';
import Footer from '../components/Footer';
import CommentsList from '../components/CommentsList';
import CreateAdoptionRequestModal from '../components/CreateAdoptionRequestModal';
import { useAuth } from '../context/AuthContext';

import './css/PetDetailPage.css';

// --- Iconos de Título ---
const PawIcon: React.FC = () => <span className="info-icon">🐾</span>;
const HealthIcon: React.FC = () => <span className="info-icon">🩺</span>;
const InfoIcon: React.FC = () => <span className="info-icon">ⓘ</span>;

// --- Icono de Salud (SVG) ---
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
    aria-hidden
    focusable={false}
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

// --- Avatar con iniciales ---
const getColorFromName = (name: string): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B739', '#52B788', '#E76F51', '#264653'
  ];
  const charCodeSum = (name || '').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[charCodeSum % colors.length];
};

const Avatar: React.FC<{ name: string; size?: number }> = ({ name, size = 40 }) => {
  const initial = (name || 'U')[0].toUpperCase();
  const backgroundColor = getColorFromName(name || 'User');

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
      aria-hidden
    >
      {initial}
    </div>
  );
};

// --- Página Principal ---
const PetDetailPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { publications, fetchPublications } = usePublications();
  const { token } = useAuth();

  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [showAdoptionModal, setShowAdoptionModal] = useState(false);

  // Traer publicaciones si es necesario
  useEffect(() => {
    if (publications.length === 0) {
      fetchPublications();
    }
  }, [fetchPublications, publications.length]);

  // Cuando cambian publicaciones o id, buscar publicación correspondiente
  useEffect(() => {
    if (!id) {
      setPublication(null);
      setLoading(false);
      return;
    }

    if (publications.length === 0) {
      setLoading(true);
      return;
    }

    const found = publications.find((p) => String(p.id) === String(id));
    if (found) {
      setPublication(found);
      // preferir la imagen principal del pet
      const mainImg = found.pet?.image || (found.post?.images && found.post.images[0]) || '';
      setActiveImage(mainImg);
    } else {
      setPublication(null);
    }
    setLoading(false);
  }, [publications, id]);

  // Proxy y manejo de urls
  const getProxiedImageUrl = (url?: string, hasError = false): string => {
    if (hasError) return 'https://via.placeholder.com/400x400?text=Sin+Imagen';
    if (!url) return 'https://via.placeholder.com/400x400?text=Sin+Imagen';
    // si la url es de tu API privada que tiene CORS problemático, proxear
    if (url.includes('ayunpet-api') || url.includes('localhost') || url.includes('127.0.0.1')) {
      return `https://corsproxy.io/?${encodeURIComponent(url)}`;
    }
    return url;
  };

  const handleImageError = (imageUrl: string) => {
    if (!imageUrl) return;
    console.warn('Error al cargar imagen:', imageUrl);
    setImageErrors(prev => ({ ...prev, [imageUrl]: true }));
  };

  const formatAge = (months: number): string => {
    if (!months && months !== 0) return 'Edad desconocida';
    if (months < 12) return `${months} Mes${months === 1 ? '' : 'es'}`;
    if (months === 12) return '1 Año';
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return `${years} Año${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` y ${remainingMonths} Meses` : ''}`;
  };

  const handleContactClick = () => {
    if (!token) {
      alert('⚠️ Debes iniciar sesión para solicitar una adopción');
      return;
    }
    setShowAdoptionModal(true);
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

  // --- Datos locales para render ---
  const { pet, creator, post } = publication;

  const detailTags: string[] = [
    pet.species || 'Especie desconocida',
    pet.breed || 'Raza desconocida',
    pet.gender || 'Género desconocido',
    pet.size || 'Tamaño desconocido',
    formatAge(pet.age ?? 0),
    ...(pet.tags || []),
  ].filter(Boolean);

  const healthTags: string[] = [];
  if (pet.healthStatus) healthTags.push(pet.healthStatus);
  if (pet.sterilized) healthTags.push('Esterilizado');

  // galería: pet.image + post.images; eliminar duplicados y URLs de ejemplo
  const galleryImages = [
    pet.image,
    ...(post?.images || []),
  ]
    .filter(Boolean)
    .filter((img, idx, arr) => arr.indexOf(img) === idx);

  const mainImageUrl = getProxiedImageUrl(activeImage, !!imageErrors[activeImage]);

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
              alt={pet.name || 'Imagen mascota'}
              className="main-image"
              onError={() => handleImageError(activeImage)}
            />
            <div className="thumbnail-list">
              {galleryImages.map((img, index) => {
                const thumbnailUrl = getProxiedImageUrl(img, !!imageErrors[img]);
                return (
                  <img
                    key={`${index}-${String(img).slice(0, 10)}`}
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

          {/* Info General */}
          <section className="pet-info-section">
            <div className="info-header">
              <PawIcon />
              <h2 className="info-title">{pet.name}</h2>
            </div>
            <p className="info-subtitle">Publicado por: <strong>{creator?.name || 'Fundación'}</strong></p>
            <div className="tag-container">
              {detailTags.map((tag, i) => (
                <PetTag key={i} label={tag} type="default" />
              ))}
            </div>
          </section>

          {/* Salud / Vacunas */}
          <section className="pet-info-section">
            <div className="info-header">
              <HealthIcon />
              <h2 className="info-title">Vacunas / Salud</h2>
            </div>
            <div className="tag-container">
              {healthTags.length > 0 ? healthTags.map((tag, i) => (
                <PetTag key={i} label={tag} type={tag.toLowerCase() === 'esterilizado' ? 'sterilized' : 'health'} />
              )) : <p>No hay información de salud disponible.</p>}
            </div>
          </section>

          {/* Descripción */}
          <section className="pet-info-section">
            <div className="info-header">
              <InfoIcon />
              <h2 className="info-title">Descripción / Más Información</h2>
            </div>
            <div className="pet-description">
              <p>{publication.description || 'Sin descripción proporcionada.'}</p>

              {/* Ejemplo de contenido adicional (puedes editar o eliminar) */}
              <p><strong>💛 Personalidad:</strong></p>
              <p>
                {pet.name} es sociable y cariñoso/a. Se lleva bien con otros animales y niños.
                Le gustan los paseos y la compañía humana; sería ideal para una familia activa.
              </p>

              <p><strong>🏠 Buscamos para {pet.name}:</strong></p>
              <p>
                Un hogar responsable que le brinde cariño, paseos diarios y compromiso.
              </p>
            </div>
          </section>

          {/* Comentarios */}
          <section className="pet-info-section" style={{ borderTop: '2px solid #f0f0f0', paddingTop: '2rem' }}>
            <div className="info-header">
              <span style={{ fontSize: '1.3rem' }}>💬</span>
              <h2 className="info-title">Comentarios</h2>
            </div>
            <CommentsList
              postId={String(publication.id)}
              AvatarComponent={Avatar}
            />
          </section>
        </main>

        {/* --- Barra Lateral --- */}
        <aside className="pet-detail-sidebar">
          {/* Widget de Fundación / Creador */}
          <div className="sidebar-widget">
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Avatar name={creator?.name || 'Fundación'} size={56} />
              <div>
                <div style={{ fontWeight: 700 }}>{creator?.name || 'Fundación'}</div>
                <div style={{ fontSize: '0.9rem' }}>{creator?.bio || ''}</div>
              </div>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button className="creator-button">Ver más de {creator?.name || 'Fundación'}</button>
              <button className="contact-button" onClick={handleContactClick}>Contactar</button>
            </div>
          </div>
        </aside>
      </div>

      <Footer />

      {publication && showAdoptionModal && (
        <CreateAdoptionRequestModal
          postId={Number(publication.id)}
          isOpen={showAdoptionModal}
          onClose={() => setShowAdoptionModal(false)}
          onSuccess={() => {
            alert('✅ Solicitud enviada exitosamente');
            setShowAdoptionModal(false);
          }}
          token={token || ''}
        />
      )}
    </div>
  );
};

export default PetDetailPage;
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

// (resto de imports y utilidades igual)
// ...

const PetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { publications, fetchPublications } = usePublications();
  const { token } = useAuth();
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});
  const [showAdoptionModal, setShowAdoptionModal] = useState(false);

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

  // ... (resto de métodos igual)

  const handleContactClick = () => {
    if (!token) {
      alert('⚠️ Debes iniciar sesión para solicitar una adopción');
      return;
    }
    setShowAdoptionModal(true);
  };

  // ... (resto del render igual)

  return (
    <div className="page-container">
      <Header />
      <div className="pet-detail-page">
        {/* ...columnas principales igual... */}
        <aside className="pet-detail-sidebar">
          {/* Widget de Contacto */}
          <div className="sidebar-widget">
            <h3>¿Desea adoptar a {publication?.pet.name}?</h3>
            <p className="widget-subtitle">¡Contáctenos!</p>
            <button className="contact-button" onClick={handleContactClick}>Solicitar Adopción</button>
          </div>
          {/* Widget Fundación igual... */}
        </aside>
      </div>
      <Footer />

      {/* Modal de Solicitud de Adopción */}
      {publication && showAdoptionModal && (
        <CreateAdoptionRequestModal
          postId={parseInt(publication.id)}
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

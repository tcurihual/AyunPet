import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { usePublications } from '../context/PublicationsContext';
import { useLoading } from '../context/LoadingContext'; 

const AdoptionPage: React.FC = () => {
  const { publications, fetchPublications } = usePublications();
  const { isLoading } = useLoading(); 

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]); 

  if (isLoading) {
    return (
      <div className="page-container">
        <Header />
        <main className="main-content">
          <h2>Cargando mascotas...</h2>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />
      <main className="main-content" style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Mascotas en Adopción</h1>
        {publications.length > 0 ? (
          publications.map(pub => (
            <div key={pub.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
              <h2>{pub.petName}</h2>
              <p>{pub.description}</p>
              <small>Publicado por: {pub.submitterName} el {pub.date}</small>
            </div>
          ))
        ) : (
          <p>Inicia sesión para ver las mascotas disponibles.</p> 
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdoptionPage;
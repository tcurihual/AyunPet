
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { usePublications } from '../context/PublicationsContext';
import { useAuth } from '../context/AuthContext';
import PetAdoptionCard from '../components/PetAdoptionCard';
import Dashboard from '../components/dashboard';


const AdoptionPage: React.FC = () => {
  const { publications, fetchPublications } = usePublications();
  const { user } = useAuth();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    fetchPublications().finally(() => {
      setIsInitialLoad(false);
    });
  }, [fetchPublications]);

  if (isInitialLoad) {
    return (
      <div className="page-container">
        <Header />
        <main className="requests-page-container">
          <h2 className="title-center">Cargando mascotas...</h2>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />
      <main className="adoption-page-container">
        <h1 className="title-center">Administrador</h1>
    
        <Dashboard />
        <div className="pets-grid">
          {user && publications.length > 0 ? (
            publications.map(pub => (
              <PetAdoptionCard key={pub.id} publication={pub} />
            ))
          ) : (
            <div className="full-width-message">
              <p>
                {user ? "No hay mascotas disponibles en este momento." : "Inicia sesión para ver las mascotas disponibles."}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdoptionPage;
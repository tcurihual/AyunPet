// pagina base ya que aun no esta la hoja de diseño definitiva por la cual guiarme


import React, { useEffect, useState } from 'react'; 
import Header from '../components/Header';
import Footer from '../components/Footer';
import { usePublications } from '../context/PublicationsContext';
import { useLoading } from '../context/LoadingContext';
import { useAuth } from '../context/AuthContext';
import PetAdoptionCard from '../components/PetAdoptionCard';

const AdoptionPage: React.FC = () => {
  const { publications, fetchPublications } = usePublications();
  const { isLoading } = useLoading();
  const { user } = useAuth();

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchPublications();
      } catch (error) {
        console.error("Error en el fetch inicial:", error);
      } finally {
        setIsInitialLoad(false);
      }
    };
    
    loadData();
  }, [fetchPublications]);

  if (isInitialLoad || isLoading) {
    return (
      <div className="page-container">
        <Header />
        <main className="requests-page-container">
          <h2 className="text-2xl font-semibold text-center">Cargando mascotas...</h2>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />
      <main className="requests-page-container">
        <h1 className="text-4xl font-bold text-[#6D3B07] text-center mb-10" style={{ fontFamily: 'monospace' }}>
          Mascotas en Adopción
        </h1>
        <div>
          {user && publications.length > 0 ? (
            publications.map(pub => (
              <PetAdoptionCard key={pub.id} publication={pub} />
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-xl text-gray-600">
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
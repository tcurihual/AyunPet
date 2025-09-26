import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfileHeader from '../components/ProfileHeader';
import StatsBar from '../components/StatsBar';
import ProfileTabs from '../components/ProfileTabs';
import ContactCard from '../components/ContactCard';
import PolicyCard from '../components/PolicyCard';
import PetAdoptionCard from '../components/PetAdoptionCard';
import { usePublications } from '../context/PublicationsContext';
import banner from '../assets/sigma.png';

const GraficoAdopciones = lazy(() => import('../components/charts/GraficoTorta'));

const InstitutionProfilePage: React.FC = () => {
  const { publications, fetchPublications } = usePublications();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [activeTab, setActiveTab] = useState('Publicaciones');

  useEffect(() => {
    fetchPublications().finally(() => {
      setIsInitialLoad(false);
    });
  }, [fetchPublications]);

  const institutionPublications = publications.filter(
    (pub) => pub.creator.name === 'Fundación Sigma'
  );

  const datosPorEspecie = useMemo(() => {
    const conteo = institutionPublications.reduce((acc, pub) => {
      const especie = pub.pet.species || 'Otro';
      acc[especie] = (acc[especie] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(conteo).map(([name, value]) => ({ name, value }));
  }, [institutionPublications]);

  const coloresEspecie = ['#FFBB28', '#00C49F', '#AF19FF'];

  if (isInitialLoad) {
    return (
      <div className="page-container">
        <Header />
        <main className="profile-page-container">
          <h2 className="title-center">Cargando muro...</h2>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />
      <div className="profile-page-container">
        <div className="profile-banner-container">
          <div className="profile-banner">
            <img src={banner} alt="Banner de la fundación" />
          </div>
          <ProfileHeader />
        </div>

        <div className="profile-layout">
          <div className="profile-main">
            <div className="main-content-card">
              <StatsBar />
              <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              
              {activeTab === 'Publicaciones' && (
                <div className="pets-grid">
                  {institutionPublications.length > 0 ? (
                    institutionPublications.map(pub => (
                      <PetAdoptionCard key={pub.id} publication={pub} />
                    ))
                  ) : (
                    <div className="full-width-message">
                      <p>Esta fundación no tiene mascotas en adopción en este momento.</p>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'Sobre Nosotros' && (
                <div style={{ padding: '20px' }}>
                  <p>Aquí iría la información sobre la fundación...</p>
                </div>
              )}
              {activeTab === 'Estadísticas' && (
                <Suspense fallback={<div style={{ textAlign: 'center', padding: '40px' }}>Cargando gráfico...</div>}>
                  <div>
                    <h3 style={{ textAlign: 'center', marginTop: '40px' }}>
                      Distribución de Especies
                    </h3>
                    {datosPorEspecie.length > 0 ? (
                      <GraficoAdopciones data={datosPorEspecie} colors={coloresEspecie} />
                    ) : (
                      <p style={{ textAlign: 'center', marginTop: '20px' }}>
                        No hay datos suficientes para mostrar estadísticas.
                      </p>
                    )}
                  </div>
                </Suspense>
              )}
              {activeTab === 'Equipo' && (
                <div style={{ padding: '20px' }}>
                  <p>Aquí iría la información sobre el equipo...</p>
                </div>
              )}
              {activeTab === 'Documentos' && (
                <div style={{ padding: '20px' }}>
                  <p>Aquí irían los documentos...</p>
                </div>
              )}
            </div>
          </div>
          
          <aside className="profile-sidebar">
            <ContactCard />
            <PolicyCard />
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InstitutionProfilePage;
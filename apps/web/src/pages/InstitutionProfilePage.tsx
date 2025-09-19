import React, { useEffect, useState } from 'react';
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

const InstitutionProfilePage: React.FC = () => {
  const { publications, fetchPublications } = usePublications();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    fetchPublications().finally(() => {
      setIsInitialLoad(false);
    });
  }, [fetchPublications]);

  const institutionPublications = publications.filter(
    (pub) => pub.creator.name === 'Fundación Sigma'
  );

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
              <ProfileTabs />
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
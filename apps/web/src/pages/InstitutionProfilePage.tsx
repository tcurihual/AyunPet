import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfileHeader from '../components/ProfileHeader';
import StatsBar from '../components/StatsBar';
import ProfileTabs from '../components/ProfileTabs';
import ContactCard from '../components/ContactCard';
import PolicyCard from '../components/PolicyCard';
import PetAdoptionCard from '../components/PetAdoptionCard';
import { usePublications } from '../context/PublicationsContext';
import banner from '../assets/sigma.png'

const InstitutionProfilePage: React.FC = () => {
  const { publications } = usePublications();
  const institutionPublications = publications.filter(
    (pub) => pub.submitterName === 'Fundacion Sigma'
  );


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
                {institutionPublications.map(pub => (
                  <PetAdoptionCard key={pub.id} publication={pub} />
                ))}
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
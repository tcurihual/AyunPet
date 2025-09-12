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

const InstitutionProfilePage: React.FC = () => {
  const { publications } = usePublications();

  return (
    <div className="page-container">
      <Header />
      <div className="profile-page-container">
        
        <div className="profile-layout">
          <div className="profile-main">
            <div className="main-content-card">
              <ProfileHeader />
              <StatsBar />
              <ProfileTabs />
              
              <div className="pets-grid">
                {publications.map(pub => (
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
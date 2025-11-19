import React from 'react';

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
}

const TABS = ['Publicaciones', 'Solicitudes', 'Sobre Nosotros', 'Estadísticas', 'Equipo', 'Documentos'];

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="profile-tabs">
      {TABS.map(tab => (
        <a
          key={tab}
          href="#"
          className={`tab-item ${activeTab === tab ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab(tab);
          }}
        >
          {tab}
        </a>
      ))}
    </nav>
  );
};

export default ProfileTabs;

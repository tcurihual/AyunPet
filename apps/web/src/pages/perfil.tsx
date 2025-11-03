import React, { useState } from 'react';
import '../index.css';
import Header from '../components/Header'; 
import Footer from '../components/Footer'; 

const UserProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('about');

  const user = {
    nombre: "José Martínez",
    rut: "12.345.678-9",
    email: "jose.martinez@example.com",
    telefono: "+56 9 1234 5678",
    ciudad: "Temuco",
    direccion: "Av. Alemania 0281",
    bio: "Amante de los animales con más de 5 años de experiencia en rescate y rehabilitación. Creo firmemente en darles una segunda oportunidad a quienes más lo necesitan. Hogar temporal certificado y voluntario activo.",
    intereses: ["Perros", "Gatos", "Adopción Responsable", "Voluntariado"],
    estadisticas: { adopciones: 3, favoritos: 8, publicaciones: 2 },
    rol: "tester",
    miembro_desde: "Enero 2024",
    avatar_color: "#4f4641"
  };

  const actividades_recientes = [
    { tipo: "adopcion", titulo: "Adoptó a Luna", fecha: "Hace 2 días", icono: "🐕" },
    { tipo: "favorito", titulo: "Guardó 3 publicaciones", fecha: "Hace 5 días", icono: "❤️" },
    { tipo: "publicacion", titulo: "Publicó sobre Max", fecha: "Hace 1 semana", icono: "📝" }
  ];

  const UserIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  const FileTextIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  );

  const HeartIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  );

  const MailIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  );

  const PhoneIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  );

  const MapPinIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  );

  const HomeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );

  const AwardIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7"></circle>
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
    </svg>
  );

  const CameraIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
      <circle cx="12" cy="13" r="4"></circle>
    </svg>
  );

  const Edit2Icon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </svg>
  );

  const SettingsIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M12 1v6m0 6v6m6-6h6M1 12h6"></path>
      <path d="M4 4l5 5m6 6l5 5M4 20l5-5m6-6l5-5"></path>
    </svg>
  );

  const tabs = [
    { id: 'about', label: 'Sobre mí', icon: <UserIcon /> },
    { id: 'activity', label: 'Actividad', icon: <FileTextIcon /> },
    { id: 'interests', label: 'Intereses', icon: <HeartIcon /> }
  ];

  const contactInfo = [
    { icon: <MailIcon />, label: 'Email', value: user.email },
    { icon: <PhoneIcon />, label: 'Teléfono', value: user.telefono },
    { icon: <MapPinIcon />, label: 'Ciudad', value: user.ciudad },
    { icon: <HomeIcon />, label: 'Dirección', value: user.direccion }
  ];

  const quickLinks = ['Mis favoritos', 'Mis publicaciones', 'Solicitudes'];

  return (
    <>
      <Header /> {/* Added Header component */}
      <div className="user-profile-page">
        <div className="user-profile-container">

          {/* Header Card */}
          <div className="profile-header-card">
            {/* Background Pattern */}
            <div className="profile-header-background" />

            {/* Profile Content */}
            <div className="profile-header-content">
              <div className="profile-header-flex">

                {/* Avatar */}
                <div className="profile-avatar-wrapper">
                  <div className="profile-avatar">
                    {user.nombre[0]}
                  </div>
                  <button className="profile-avatar-camera-btn">
                    <CameraIcon />
                  </button>
                </div>

                {/* User Info */}
                <div className="profile-user-info">
                  <div className="profile-user-name-row">
                    <h1 className="profile-user-name">
                      {user.nombre}
                    </h1>
                    <span className="profile-role-badge">
                      {user.rol}
                    </span>
                  </div>
                  <p className="profile-member-since">
                    <AwardIcon />
                    Miembro desde {user.miembro_desde}
                  </p>

                  {/* Stats Row */}
                  <div className="profile-stats-row">
                    <div className="profile-stat-item">
                      <div className="profile-stat-value adopciones">
                        {user.estadisticas.adopciones}
                      </div>
                      <div className="profile-stat-label">
                        Adopciones
                      </div>
                    </div>
                    <div className="profile-stat-item">
                      <div className="profile-stat-value favoritos">
                        {user.estadisticas.favoritos}
                      </div>
                      <div className="profile-stat-label">
                        Favoritos
                      </div>
                    </div>
                    <div className="profile-stat-item">
                      <div className="profile-stat-value publicaciones">
                        {user.estadisticas.publicaciones}
                      </div>
                      <div className="profile-stat-label">
                        Publicaciones
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="profile-actions">
                  <button className="profile-btn-primary">
                    <Edit2Icon />
                    Editar Perfil
                  </button>
                  <button className="profile-btn-secondary">
                    <SettingsIcon />
                    Configuración
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="profile-content-grid">

            {/* Left Column */}
            <div className="profile-left-column">

              {/* Tabs */}
              <div className="profile-tabs-container">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`profile-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="profile-tab-content">
                {activeTab === 'about' && (
                  <div>
                    <h3 className="profile-tab-title">Sobre mí</h3>
                    <p className="profile-bio-text">{user.bio}</p>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div>
                    <h3 className="profile-tab-title">Actividad Reciente</h3>
                    <div className="profile-activity-list">
                      {actividades_recientes.map((act, i) => (
                        <div key={i} className="profile-activity-item">
                          <div className="profile-activity-icon">
                            {act.icono}
                          </div>
                          <div className="profile-activity-content">
                            <div className="profile-activity-title">
                              {act.titulo}
                            </div>
                            <div className="profile-activity-date">
                              {act.fecha}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'interests' && (
                  <div>
                    <h3 className="profile-tab-title">Mis Intereses</h3>
                    <div className="profile-interests-grid">
                      {user.intereses.map((int, i) => (
                        <span key={i} className="profile-interest-tag">
                          {int}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="profile-right-column">

              {/* Contact Card */}
              <div className="profile-contact-card">
                <h4 className="profile-card-title">
                  Información de Contacto
                </h4>
                <div className="profile-contact-list">
                  {contactInfo.map((item, i) => (
                    <div key={i} className="profile-contact-item">
                      <div className="profile-contact-icon">
                        {item.icon}
                      </div>
                      <div className="profile-contact-content">
                        <div className="profile-contact-label">
                          {item.label}
                        </div>
                        <div className="profile-contact-value">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="profile-contact-card">
                <h4 className="profile-card-title">
                  Accesos Rápidos
                </h4>
                <div className="profile-quick-links">
                  {quickLinks.map((link, i) => (
                    <a
                      key={i}
                      href="#"
                      className="profile-quick-link"
                    >
                      {link}
                    </a>
                  ))}
                  {(user.rol === "admin" || user.rol === "tester") && (
                    <a
                      href="#"
                      className="profile-quick-link admin"
                    >
                      🛡️ Ver reportes
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer /> {/* Added Footer component */}
    </>
  );
};

export default UserProfile;
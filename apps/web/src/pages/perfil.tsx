import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import '../components/perfil.css';

interface UserProfileData {
  id: string | number;
  role: string | number;
  rut: string;
  email: string;
  name: string;
  validated: boolean;
  address?: string;
  description?: string;
  created_at?: string;
}

const solicitudesEjemplo = [
  {
    id: "1",
    nombreMascota: "Max",
    fotoMascota: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg",
    tipoMascota: "Perro",
    edadMascota: "2 años",
    estado: "En revisión",
    fechaSolicitud: "Solicitado el 10 Nov 2025",
  },
  {
    id: "2",
    nombreMascota: "Luna",
    fotoMascota: "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg",
    tipoMascota: "Gato",
    edadMascota: "1 año",
    estado: "Pendiente",
    fechaSolicitud: "Solicitado el 12 Nov 2025",
  },
  {
    id: "3",
    nombreMascota: "Rocky",
    fotoMascota: "https://images.pexels.com/photos/1938126/pexels-photo-1938126.jpeg",
    tipoMascota: "Perro",
    edadMascota: "3 meses",
    estado: "En revisión",
    fechaSolicitud: "Solicitado el 15 Nov 2025",
  },
];

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulación, reemplaza esto por la llamada real a tu login API si lo necesitas.
    setTimeout(() => {
      setProfileData({
        id: 76,
        role: 20,
        rut: "203575823",
        email: "paxchipro27@gmail.com",
        name: "José Jiménez",
        validated: true,
        address: "lima,peru",
        description: "tryhard del profe caro",
        created_at: "2025-11-08T00:03:54.987004",
      });
      setIsLoading(false);
    }, 300);
  }, []);

  if (isLoading || !profileData) {
    return (
      <>
        <Header />
        <Loading />
        <Footer />
      </>
    );
  }

  // Fecha
  const miembroDesde = profileData.created_at
    ? new Date(profileData.created_at).toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })
    : 'Recientemente';

  // Verificar si es institución (rol 21)
  const isInstitution = profileData.role === 21 || profileData.role === '21';

  return (
    <>
      <Header />
      <div className="perfil-main-container">
        <div className="perfil-card">
          <div className="perfil-row-top">
            <div className="perfil-avatar-section">
              <div className="perfil-avatar-box">
                {/* Avatar sólo inicial del nombre */}
                <span className="perfil-avatar-text">{profileData.name.charAt(0)}</span>
              </div>
            </div>
            <div className="perfil-info-section">
              <div className="perfil-nombre-rol">
                <span className="perfil-nombre">{profileData.name}</span>
                <span className="perfil-rol">{isInstitution ? 'Institución' : 'Usuario'}</span>
              </div>
              <div className="perfil-miembro">
                Miembro desde {miembroDesde}
              </div>
              <div className="perfil-adopciones-num">0</div>
              <div className="perfil-adopciones-label">ADOPCIONES</div>
            </div>
          </div>

          {/* Botón Crear Post solo para instituciones */}
          {isInstitution && (
            <div className="perfil-crear-post-section">
              <button 
                className="perfil-btn-crear-post"
                onClick={() => navigate('/crear-post')}
              >
                ➕ Crear Publicación
              </button>
            </div>
          )}

          <div className="perfil-divider" />
          <div className="perfil-content-columns">
            <div className="perfil-left">
              <div className="perfil-section-title"><span>Sobre mí</span></div>
              <div className="perfil-section-box">
                <div className="perfil-bio">{profileData.description}</div>
              </div>
              <div className="perfil-section-title" style={{ marginTop: 30 }}>
                <span>Solicitudes Pendientes de Adopción</span>
              </div>
              <div className="perfil-solicitudes-list">
                {solicitudesEjemplo.map((s) => (
                  <div key={s.id} className="perfil-solicitud-card">
                    <img src={s.fotoMascota} alt={s.nombreMascota} className="perfil-solicitud-img" />
                    <div className="perfil-solicitud-info">
                      <div className="perfil-solicitud-nombre">{s.nombreMascota}</div>
                      <div className="perfil-solicitud-desc">{s.tipoMascota} • {s.edadMascota}</div>
                      <div className="perfil-solicitud-fecha">{s.fechaSolicitud}</div>
                    </div>
                    <div className={
                      s.estado === "Pendiente"
                        ? "perfil-solicitud-estado pendiente"
                        : "perfil-solicitud-estado revision"
                    }>
                      {s.estado}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="perfil-right">
              <div className="perfil-section-title">Información de Contacto</div>
              <div className="perfil-contact-list">
                <div className="perfil-contact-item">
                  <span className="perfil-contact-label">EMAIL</span>
                  <span className="perfil-contact-value">{profileData.email}</span>
                </div>
                <div className="perfil-contact-item">
                  <span className="perfil-contact-label">CIUDAD</span>
                  <span className="perfil-contact-value">Temuco</span>
                </div>
                <div className="perfil-contact-item">
                  <span className="perfil-contact-label">DIRECCIÓN</span>
                  <span className="perfil-contact-value">{profileData.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;

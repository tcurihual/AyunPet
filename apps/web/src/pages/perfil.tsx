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
    if (user) {
      const userRole = typeof user.role === 'string' ? parseInt(user.role) : user.role;

      // Si es institución (rol 21), redirigir a su muro
      if (userRole === 21) {
        navigate('/institution-profile');
        return;
      }
      // Si es dador de adopción (rol 22), puedes redirigir en el futuro si tienes perfil para este rol
      
      // Si es usuario normal (rol 20), cargar perfil
      setProfileData({
        id: user.id,
        role: user.role,
        rut: user.rut || '',
        email: user.email,
        name: user.name,
        validated: user.validated !== undefined ? user.validated : true,
        address: user.address || null,
        description: user.description || null,
        created_at: user.created_at || new Date().toISOString(),
      });
      setIsLoading(false);
    } else {
      // Si no hay usuario en contexto, redirigir al login
      setIsLoading(false);
      navigate('/login');
    }
  }, [user, navigate]);

  if (isLoading || !profileData) {
    return (
      <>
        <Header />
        <Loading />
        <Footer />
      </>
    );
  }

  const miembroDesde = profileData.created_at
    ? new Date(profileData.created_at).toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })
    : 'Recientemente';

  return (
    <>
      <Header />
      <div className="perfil-main-container">
        <div className="perfil-card">
          <div className="perfil-row-top">
            <div className="perfil-avatar-section">
              <div className="perfil-avatar-box">
                <span className="perfil-avatar-text">{profileData.name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <div className="perfil-info-section">
              <div className="perfil-nombre-rol">
                <span className="perfil-nombre">{profileData.name}</span>
                <span className="perfil-rol">Usuario</span>
              </div>
              <div className="perfil-miembro">
                Miembro desde {miembroDesde}
              </div>
              <div className="perfil-adopciones-num">0</div>
              <div className="perfil-adopciones-label">ADOPCIONES</div>
            </div>
          </div>
          <div className="perfil-divider" />
          <div className="perfil-content-columns">
            <div className="perfil-left">
              <div className="perfil-section-title"><span>Sobre mí</span></div>
              <div className="perfil-section-box">
                <div className="perfil-bio">
                  {profileData.description || 'Sin descripción proporcionada.'}
                </div>
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
                  <span className="perfil-contact-value">
                    {profileData.address || 'No especificada'}
                  </span>
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

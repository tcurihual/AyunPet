import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfileHeader from '../components/ProfileHeader';
import StatsBar from '../components/StatsBar';
import ProfileTabs from '../components/ProfileTabs';
import ContactCard from '../components/ContactCard';
import PolicyCard from '../components/PolicyCard';
import PetAdoptionCard from '../components/PetAdoptionCard';
import { fetchInstitutionProfile, fetchInstitutionPublications } from '../lib/institutionService';
import banner from '../assets/sigma.png';

const GraficoTorta = lazy(() => import('../components/charts/PieChart'));

interface InstitutionData {
  id: string;
  name: string;
  email: string;
  description?: string;
  address?: string;
}

const InstitutionProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [institutionData, setInstitutionData] = useState<InstitutionData | null>(null);
  const [publications, setPublications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Publicaciones');

  // Cargar datos de la institución y sus publicaciones
  useEffect(() => {
    const loadInstitutionData = async () => {
      if (!id) {
        setError('ID de institución no proporcionado');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Obtener token del usuario autenticado
        const token = localStorage.getItem('authToken');
        
        // Obtener perfil de la institución
        const profileResult = await fetchInstitutionProfile(id, token || undefined);
        if (!profileResult.ok || !profileResult.data) {
          setError(profileResult.error || 'Error al cargar el perfil');
          setIsLoading(false);
          return;
        }
        setInstitutionData(profileResult.data as InstitutionData);

        // Obtener publicaciones de la institución
        const publicationsResult = await fetchInstitutionPublications(id, token || undefined);
        if (publicationsResult.ok && publicationsResult.data) {
          setPublications(publicationsResult.data);
        } else {
          console.warn('Error al cargar publicaciones:', publicationsResult.error);
          setPublications([]);
        }
      } catch (err: any) {
        setError(err?.message || 'Error desconocido al cargar datos');
      } finally {
        setIsLoading(false);
      }
    };

    loadInstitutionData();
  }, [id]);

  // Contar mascotas por especie
  const datosPorEspecie = useMemo(() => {
    const conteo: Record<string, number> = {};
    publications.forEach((pub) => {
      const especie = pub.pet?.species || 'Otro';
      conteo[especie] = (conteo[especie] || 0) + 1;
    });
    return Object.entries(conteo).map(([name, value]) => ({ name, value }));
  }, [publications]);

  const coloresEspecie = ['#FFBB28', '#00C49F', '#AF19FF'];

  // Estado de carga inicial
  if (isLoading) {
    return (
      <div className="page-container">
        <Header />
        <main className="profile-page-container">
          <h2 className="title-center">Cargando muro de la institución...</h2>
        </main>
        <Footer />
      </div>
    );
  }

  // Mostrar error si existe
  if (error) {
    return (
      <div className="page-container">
        <Header />
        <main className="profile-page-container">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h2>Error</h2>
            <p>{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Si no hay datos
  if (!institutionData) {
    return (
      <div className="page-container">
        <Header />
        <main className="profile-page-container">
          <h2 className="title-center">Institución no encontrada</h2>
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
              
              {/* Tab: Publicaciones */}
              {activeTab === 'Publicaciones' && (
                <div className="pets-grid">
                  {publications.length > 0 ? (
                    publications.map(pub => (
                      <PetAdoptionCard key={pub.id} publication={pub} />
                    ))
                  ) : (
                    <div className="full-width-message">
                      <p>Esta institución no tiene mascotas en adopción en este momento.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Sobre Nosotros */}
              {activeTab === 'Sobre Nosotros' && (
                <div style={{ padding: '20px' }}>
                  <h3>{institutionData.name}</h3>
                  <p>{institutionData.description || 'Sin descripción disponible'}</p>
                  {institutionData.address && (
                    <p><strong>Dirección:</strong> {institutionData.address}</p>
                  )}
                  <p><strong>Correo:</strong> {institutionData.email}</p>
                </div>
              )}

              {/* Tab: Estadísticas */}
              {activeTab === 'Estadísticas' && (
                <Suspense fallback={<div style={{ textAlign: 'center', padding: '40px' }}>Cargando gráfico...</div>}>
                  <div>
                    <h3 style={{ textAlign: 'center', marginTop: '40px' }}>
                      Distribución de Especies
                    </h3>
                    {datosPorEspecie.length > 0 ? (
                      <GraficoTorta data={datosPorEspecie} colors={coloresEspecie} />
                    ) : (
                      <p style={{ textAlign: 'center', marginTop: '20px' }}>
                        No hay datos suficientes para mostrar estadísticas.
                      </p>
                    )}
                  </div>
                </Suspense>
              )}

              {/* Tab: Equipo */}
              {activeTab === 'Equipo' && (
                <div style={{ padding: '20px' }}>
                  <p>Información del equipo disponible próximamente...</p>
                </div>
              )}

              {/* Tab: Documentos */}
              {activeTab === 'Documentos' && (
                <div style={{ padding: '20px' }}>
                  <p>Documentos disponibles próximamente...</p>
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

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
  const { id: paramId } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  // Log para debugging
  console.log('[InstitutionProfilePage] paramId:', paramId);
  console.log('[InstitutionProfilePage] user:', user);
  
  // Si viene un parámetro de URL, úsalo. Si no, usa el ID del usuario logueado
  const institutionId = paramId || user?.id;
  
  console.log('[InstitutionProfilePage] institutionId final:', institutionId);
  
  const [institutionData, setInstitutionData] = useState<InstitutionData | null>(null);
  const [publications, setPublications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Publicaciones');

  // Cargar datos de la institución y sus publicaciones
  useEffect(() => {
    const loadInstitutionData = async () => {
      console.log('[loadInstitutionData] Starting with ID:', institutionId);
      
      if (!institutionId) {
        const errorMsg = 'ID de institución no proporcionado y no hay usuario logueado';
        console.error('[loadInstitutionData]', errorMsg);
        setError(errorMsg);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Obtener token del usuario autenticado
        const token = localStorage.getItem('authToken');
        console.log('[loadInstitutionData] Token available:', !!token);
        
        // Obtener perfil de la institución
        console.log('[loadInstitutionData] Fetching profile for ID:', institutionId);
        const profileResult = await fetchInstitutionProfile(institutionId, token || undefined);
        console.log('[loadInstitutionData] Profile result:', profileResult);
        
        if (!profileResult.ok || !profileResult.data) {
          const errMsg = profileResult.error || 'Error al cargar el perfil';
          console.error('[loadInstitutionData] Profile error:', errMsg);
          setError(errMsg);
          setIsLoading(false);
          return;
        }
        setInstitutionData(profileResult.data as InstitutionData);
        console.log('[loadInstitutionData] Profile loaded successfully');

        // Obtener publicaciones de la institución
        console.log('[loadInstitutionData] Fetching publications for ID:', institutionId);
        const publicationsResult = await fetchInstitutionPublications(institutionId, token || undefined);
        console.log('[loadInstitutionData] Publications result:', publicationsResult);
        
        if (publicationsResult.ok && publicationsResult.data) {
          setPublications(publicationsResult.data);
          console.log('[loadInstitutionData] Publications loaded:', publicationsResult.data.length, 'items');
        } else {
          console.warn('[loadInstitutionData] Publications error:', publicationsResult.error);
          setPublications([]);
        }
      } catch (err: any) {
        console.error('[loadInstitutionData] Exception:', err);
        setError(err?.message || 'Error desconocido al cargar datos');
      } finally {
        setIsLoading(false);
      }
    };

    loadInstitutionData();
  }, [institutionId]);

  // Contar mascotas por especie
  const datosPorEspecie = useMemo(() => {
    const conteo: Record<string, number> = {};
      if (!Array.isArray(publications) || publications.length === 0) {
            return [];
          }
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
                  {publications && publications.length > 0 ? (
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
                    {datosPorEspecie && datosPorEspecie.length > 0 ? (
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

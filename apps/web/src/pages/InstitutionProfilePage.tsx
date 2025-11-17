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
  rut?: string;
  phone?: string;
  website?: string;
}

const InstitutionProfilePage: React.FC = () => {
  const { id: paramId } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const institutionId = paramId || user?.id;
  
  const [institutionData, setInstitutionData] = useState<InstitutionData | null>(null);
  const [publications, setPublications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  156
    , setActiveTab] = useState('Publicaciones');

  useEffect(() => {
    const loadInstitutionData = async () => {
      if (!institutionId) {
        setError('ID de institución no proporcionado');
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');
        
        const profileResult = await fetchInstitutionProfile(institutionId, token || undefined);
        
        if (!profileResult.ok || !profileResult.data) {
          setError(profileResult.error || 'Error al cargar el perfil');
          setIsLoading(false);
          return;
        }
        setInstitutionData(profileResult.data);
        
        const publicationsResult = await fetchInstitutionPublications(institutionId, token || undefined);
        if (publicationsResult.ok && publicationsResult.data) {
          setPublications(publicationsResult.data);
        } else {
          setPublications([]);
        }
      } catch (err: any) {
        setError(err?.message || 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };
    loadInstitutionData();
  }, [institutionId]);

  // Cálculo mejorado de estadísticas basado en datos reales
  const stats = useMemo(() => {
    if (!Array.isArray(publications) || publications.length === 0) {
      return { activas: 0, adoptadas: 0, exitoPercentage: 0, tiempoRespuesta: 'N/A', rating: 0 };
    }
    
    const activas = publications.filter((pub: any) => pub.status !== 'adopted' && pub.adopted !== true).length;
    const adoptadas = publications.filter((pub: any) => pub.status === 'adopted' || pub.adopted === true).length;
    const totalPublicaciones = publications.length;
    const exitoPercentage = totalPublicaciones > 0 ? Math.round((adoptadas / totalPublicaciones) * 100) : 0;
    
    return {
      activas,
      adoptadas,
      exitoPercentage,
      tiempoRespuesta: '~3h',
      rating: 4.8
    };
  }, [publications]);

  // Datos por especie
  const datosPorEspecie = useMemo(() => {
    const conteo: Record<string, number> = {};
    if (!Array.isArray(publications) || publications.length === 0) return [];
    
    publications.forEach((pub) => {
      const especie = pub.pet?.species || 'Otro';
      conteo[especie] = (conteo[especie] || 0) + 1;
    });
    return Object.entries(conteo).map(([name, value]) => ({ name, value }));
  }, [publications]);

  const coloresEspecie = ['#FFBB28', '#00C49F', '#AF19FF'];

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
            <img src={banner} alt="Banner" />
          </div>
          <ProfileHeader
          
            name={institutionData.name}
            handle={`@${institutionData.name.toLowerCase().replace(/\s+/g, '')} - ${institutionData.address || 'No especificado'}`}
            description={institutionData.description}
                  mural={institutionData.profile_mural}
        isEditable={true}
                token={localStorage.getItem('authToken') || ''}
          />
        </div>
        <div className="profile-layout">
          <div className="profile-main">
            <div className="main-content-card">
              <StatsBar 
                activas={stats.activas}
                adoptadas={stats.adoptadas}
                exitoPercentage={stats.exitoPercentage}
                tiempoRespuesta={stats.tiempoRespuesta}
                rating={stats.rating}
              />
              <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              
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
              
              {activeTab === 'Sobre Nosotros' && (
                <div style={{ padding: '20px' }}>
                  <h3>{institutionData.name}</h3>
                  <div style={{ marginTop: '15px', lineHeight: '1.6' }}>
                    <p><strong>Descripción:</strong></p>
                    <p>{institutionData.description || 'Sin descripción disponible'}</p>
                    
                  </div>
                </div>
              )}
              
              {activeTab === 'Estadísticas' && (
                <Suspense fallback={<div style={{ textAlign: 'center', padding: '40px' }}>Cargando gráfico...</div>}>
                  <div>
                    <h3 style={{ textAlign: 'center', marginTop: '40px' }}>Distribución de Especies</h3>
                    {datosPorEspecie && datosPorEspecie.length > 0 ? (
                      <GraficoTorta data={datosPorEspecie} colors={coloresEspecie} />
                    ) : (
                      <p style={{ textAlign: 'center', marginTop: '20px' }}>No hay datos disponibles.</p>
                    )}
                  </div>
                </Suspense>
              )}
              
              {activeTab === 'Equipo' && (
                <div style={{ padding: '20px' }}>
                  <p>Información del equipo disponible próximamente...</p>
                </div>
              )}
              
              {activeTab === 'Documentos' && (
                <div style={{ padding: '20px' }}>
                  <p>Documentos disponibles próximamente...</p>
                </div>
              )}
            </div>
          </div>
          
          <aside className="profile-sidebar">
            <ContactCard 
              phone={institutionData.phone}
              email={institutionData.email}
              website={institutionData.website}
            />
            <PolicyCard />
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InstitutionProfilePage;

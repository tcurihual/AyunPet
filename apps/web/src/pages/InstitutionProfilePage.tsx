import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfileHeader from '../components/ProfileHeader';
import StatsBar from '../components/StatsBar';
import ProfileTabs from '../components/ProfileTabs';
import ContactCard from '../components/ContactCard';
import PolicyCard from '../components/PolicyCard';
import PetAdoptionCard from '../components/PetAdoptionCard';
import InstitutionPetCard from '../components/InstitutionPetCard';
import { fetchInstitutionProfile } from '../lib/institutionService';
import banner from '../assets/sigma.png';
const GraficoTorta = lazy(() => import('../components/charts/PieChart'));

const API_BASE_URL = 'http://ayunpet-api.eastus2.cloudapp.azure.com/v1';

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
  const navigate = useNavigate();
  
  const institutionId = paramId || user?.id;
  const isOwnProfile = !paramId && !!user?.id;
  
  const [institutionData, setInstitutionData] = useState<InstitutionData | null>(null);
  const [publications, setPublications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Publicaciones');

  useEffect(() => {
    if (user && !paramId) {
      const userRole = typeof user.role === 'string' ? parseInt(user.role) : user.role;
      
      if (userRole === 20) {
        navigate('/perfil');
        return;
      }
    }
  }, [user, paramId, navigate]);

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
        
        // Cargar perfil de institución
        const profileResult = await fetchInstitutionProfile(institutionId, token || undefined);
        
        if (!profileResult.ok || !profileResult.data) {
          setError(profileResult.error || 'Error al cargar el perfil');
          setIsLoading(false);
          return;
        }
        setInstitutionData(profileResult.data);
        
        // Cargar publicaciones desde la API real
        const publicationsResponse = await fetch(
          `${API_BASE_URL}/adoptions/publications?page=1&pageSize=100&ownerId=${institutionId}&status=active`, 
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!publicationsResponse.ok) {
          throw new Error('Error al cargar publicaciones');
        }

        const result = await publicationsResponse.json();
        const allPublications = result.data?.items || [];
        
        console.log('📋 Publicaciones de institución:', allPublications.length);
        setPublications(allPublications);

      } catch (err: any) {
        console.error('❌ Error:', err);
        setError(err?.message || 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };
    loadInstitutionData();
  }, [institutionId]);

  // Funciones de editar/eliminar
  const handleDeletePublication = async (publicationId: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer.')) {
      return;
    }

    const token = localStorage.getItem('authToken');
    
    try {
      const response = await fetch(`${API_BASE_URL}/adoptions/publications/${publicationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar publicación');
      }

      alert('✅ Publicación eliminada exitosamente');
      
      // Recargar publicaciones
      const updatedPubs = publications.filter(item => item.post.id !== publicationId);
      setPublications(updatedPubs);
    } catch (err: any) {
      console.error('❌ Error al eliminar:', err);
      alert(`❌ Error: ${err.message}`);
    }
  };

  const handleEditPublication = (publicationId: number) => {
    navigate(`/editar-post/${publicationId}`);
  };

  // Cálculo de estadísticas basado en datos reales
  const stats = useMemo(() => {
    if (!Array.isArray(publications) || publications.length === 0) {
      return { activas: 0, adoptadas: 0, exitoPercentage: 0, tiempoRespuesta: 'N/A', rating: 0 };
    }
    
    const activas = publications.filter((item: any) => item.post?.status === 'active').length;
    const adoptadas = publications.filter((item: any) => item.pet?.adopted === true).length;
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
    
    publications.forEach((item) => {
      const especie = item.pet?.species || 'Otro';
      const especieTraducida = especie === 'dog' ? 'Perro' : especie === 'cat' ? 'Gato' : especie;
      conteo[especieTraducida] = (conteo[especieTraducida] || 0) + 1;
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
                    publications.map(item => (
                      isOwnProfile ? (
                        <InstitutionPetCard 
                          key={item.post.id} 
                          publication={item}
                          showActions={true}
                          onDelete={handleDeletePublication}
                          onEdit={handleEditPublication}
                        />
                      ) : (
                        <PetAdoptionCard 
                          key={item.post.id} 
                          publication={{
                            id: item.post.id,
                            description: item.post.description,
                            creator: item.creator,
                            pet: {
                              ...item.pet,
                              age: (item.pet.age_years * 12) + item.pet.age_months,
                              breed: item.pet.breed || 'Mestizo',
                              tags: []
                            },
                            post: item.post
                          }}
                        />
                      )
                    ))
                  ) : (
                    <div className="full-width-message">
                      <p>Esta institución no tiene mascotas en adopción en este momento.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Solicitudes' && (
                <div style={{ padding: '20px' }}>
                  <h3 style={{ marginBottom: '1.5rem' }}>Solicitudes de Adopción</h3>
                  <div style={{
                    padding: '3rem 2rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px',
                    textAlign: 'center',
                    border: '2px dashed #dee2e6'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                    <h4 style={{ color: '#495057', marginBottom: '0.5rem' }}>Sin solicitudes pendientes</h4>
                    <p style={{ fontSize: '1rem', color: '#868e96', margin: 0 }}>
                      Aquí aparecerán las solicitudes de adopción cuando lleguen
                    </p>
                  </div>
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

            {/* Botón Crear Publicación - Solo si es el perfil propio */}
            {isOwnProfile && user && user.role === 21 && (
              <div className="sidebar-widget" style={{ marginTop: '1rem' }}>
                <button 
                  onClick={() => navigate('/crear-post')}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #FF6B35 0%, #f94a29 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.875rem 1.5rem',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 107, 53, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
                  }}
                >
                  ➕ Crear Publicación
                </button>
              </div>
            )}

            <PolicyCard />
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InstitutionProfilePage;

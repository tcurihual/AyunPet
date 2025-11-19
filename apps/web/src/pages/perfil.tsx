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

interface AdoptionRequest {
  id: number;
  post_id: number;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
  postImages: string[];
}

const API_BASE_URL = 'http://ayunpet-api.eastus2.cloudapp.azure.com/v1';

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [solicitudes, setSolicitudes] = useState<AdoptionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);

  useEffect(() => {
    if (user) {
      const userRole = typeof user.role === 'string' ? parseInt(user.role) : user.role;

      if (userRole === 21) {
        navigate('/muro-institucion');
        return;
      }
      
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
      
      loadAdoptionRequests();
    } else {
      setIsLoading(false);
      navigate('/login');
    }
  }, [user, navigate]);

  const loadAdoptionRequests = async () => {
    const token = localStorage.getItem('authToken');
    
    try {
      setIsLoadingRequests(true);
      
      console.log('🔍 Cargando solicitudes para usuario...');
      
      const response = await fetch(`${API_BASE_URL}/adoptions/adoption-requests?page=1&pageSize=50`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar solicitudes');
      }

      const result = await response.json();
      console.log('✅ Solicitudes del usuario:', result);
      
      if (result.data && Array.isArray(result.data)) {
        const solicitudesConImagenes = await Promise.all(
          result.data.map(async (sol: AdoptionRequest) => {
            try {
              const postResponse = await fetch(`${API_BASE_URL}/adoptions/publications/${sol.post_id}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });

              if (postResponse.ok) {
                const postData = await postResponse.json();
                const images = postData.data?.post?.images || postData.data?.images || [];
                
                // ✅ CARGAR IMÁGENES COMO DATA URL
                if (images.length > 0) {
                  try {
                    const imageResponse = await fetch(images[0], {
                      headers: {
                        'Authorization': `Bearer ${token}`
                      }
                    });
                    
                    if (imageResponse.ok) {
                      const blob = await imageResponse.blob();
                      const dataUrl = await new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.readAsDataURL(blob);
                      });
                      
                      return {
                        ...sol,
                        postImages: [dataUrl]
                      };
                    }
                  } catch (imgErr) {
                    console.error('Error cargando imagen como blob:', imgErr);
                  }
                }
                
                return {
                  ...sol,
                  postImages: images
                };
              }
              
              return sol;
            } catch (err) {
              console.error(`❌ Error cargando post ${sol.post_id}:`, err);
              return sol;
            }
          })
        );
        
        console.log('✅ Solicitudes con imágenes:', solicitudesConImagenes);
        setSolicitudes(solicitudesConImagenes);
      } else {
        setSolicitudes([]);
      }
    } catch (err: any) {
      console.error('❌ Error al cargar solicitudes:', err);
      setSolicitudes([]);
    } finally {
      setIsLoadingRequests(false);
    }
  };


  const handleDeleteRequest = async (requestId: number) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta solicitud?')) {
      return;
    }

    const token = localStorage.getItem('authToken');
    
    try {
      const response = await fetch(`${API_BASE_URL}/adoptions/adoption-requests/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar solicitud');
      }

      alert('✅ Solicitud cancelada exitosamente');
      loadAdoptionRequests();
    } catch (err: any) {
      console.error('❌ Error al eliminar:', err);
      alert(`❌ Error: ${err.message}`);
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'Pendiente',
      'approved': 'Aprobada',
      'rejected': 'Rechazada',
      'completed': 'Completada'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status: string) => {
    if (status === 'pending') return 'perfil-solicitud-estado pendiente';
    if (status === 'approved') return 'perfil-solicitud-estado revision';
    if (status === 'rejected') return 'perfil-solicitud-estado rechazada';
    if (status === 'completed') return 'perfil-solicitud-estado completada';
    return 'perfil-solicitud-estado';
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-CL', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

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
              <div className="perfil-adopciones-num">{solicitudes.filter(s => s.status === 'completed').length}</div>
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
                <span>Mis Solicitudes de Adopción ({solicitudes.length})</span>
              </div>
              <div className="perfil-solicitudes-list">
                {isLoadingRequests ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    Cargando solicitudes...
                  </div>
                ) : solicitudes.length > 0 ? (
                  solicitudes.map((s) => (
                    <div key={s.id} className="perfil-solicitud-card">
                      {s.postImages && s.postImages.length > 0 ? (
                        <img
                          src={s.postImages[0]}
                          alt="Mascota"
                          className="perfil-solicitud-img"
                          crossOrigin="use-credentials"  // ✅ AGREGAR ESTO
                          onError={(e) => {
                            console.error('❌ Error cargando imagen:', s.postImages[0]);
                            e.currentTarget.style.display = 'none';
                            const fallback = document.createElement('div');
                            fallback.style.cssText = 'width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; font-size: 2rem; background-color: #f3f4f6; border-radius: 8px; flex-shrink: 0;';
                            fallback.textContent = '🐾';
                            e.currentTarget.parentElement?.insertBefore(fallback, e.currentTarget);
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '80px',
                          height: '80px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem',
                          backgroundColor: '#f3f4f6',
                          borderRadius: '8px',
                          flexShrink: 0
                        }}>
                          🐾
                        </div>
                      )}
                      <div className="perfil-solicitud-info">
                        <div className="perfil-solicitud-nombre">Publicación #{s.post_id}</div>
                        <div className="perfil-solicitud-desc">
                          Solicitud #{s.id}
                        </div>
                        <div className="perfil-solicitud-fecha">
                          Solicitado el {formatDate(s.created_at)}
                        </div>
                        {s.message && (
                          <div style={{ 
                            fontSize: '0.85rem', 
                            color: '#666', 
                            marginTop: '0.25rem',
                            fontStyle: 'italic'
                          }}>
                            "{s.message.substring(0, 50)}{s.message.length > 50 ? '...' : ''}"
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                        <div className={getStatusClass(s.status)}>
                          {getStatusLabel(s.status)}
                        </div>
                        {s.status === 'pending' && (
                          <button
                            onClick={() => handleDeleteRequest(s.id)}
                            style={{
                              padding: '0.375rem 0.75rem',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              fontWeight: '600'
                            }}
                          >
                            ❌ Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '3rem 2rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px',
                    border: '2px dashed #dee2e6'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                    <h4 style={{ color: '#495057', marginBottom: '0.5rem' }}>Sin solicitudes</h4>
                    <p style={{ fontSize: '0.95rem', color: '#868e96', margin: 0 }}>
                      Aún no has solicitado adoptar ninguna mascota
                    </p>
                  </div>
                )}
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

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CommentsList from '../components/CommentsList';
import CreateAdoptionRequestModal from '../components/CreateAdoptionRequestModal';
import { useAuth } from '../context/AuthContext';

interface Post {
  id: number;
  title: string;
  description: string;
  creator_name: string;
  created_at: string;
  pet_name: string;
  pet_species: string;
  pet_images: string[];
}

const API_BASE_URL = 'http://ayunpet-api.eastus2.cloudapp.azure.com/v1';

// Función para generar color basado en el nombre
const getColorFromName = (name: string): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B739', '#52B788', '#E76F51', '#264653'
  ];
  
  const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[charCodeSum % colors.length];
};

// Componente Avatar con iniciales
const Avatar: React.FC<{ name: string; size?: number }> = ({ name, size = 40 }) => {
  const initial = (name || 'U')[0].toUpperCase();
  const backgroundColor = getColorFromName(name);
  
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: size * 0.4,
        flexShrink: 0,
      }}
    >
      {initial}
    </div>
  );
};

const PostPage: React.FC = () => {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdoptionModal, setShowAdoptionModal] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    
    const authToken = localStorage.getItem('authToken') || 
                  sessionStorage.getItem('authToken') || '';
    
    try {
      const response = await fetch(`${API_BASE_URL}/adoptions/publications?page=1&pageSize=100`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Respuesta recibida:', result.message);
      console.log('📊 Total en API:', result.data?.total || 0);

      // Extraer publicaciones de result.data.items
      const publications = result.data?.items || [];
      console.log('📋 Publicaciones encontradas:', publications.length);

      if (publications.length > 0) {
        // Formatear y filtrar solo publicaciones activas
        const formattedPosts: Post[] = publications
          .filter((item: any) => item.post?.status === 'active') // Solo activas
          .map((item: any) => {
            const post = item.post;
            const pet = item.pet;
            const creator = item.creator;

            return {
              id: post.id,
              title: post.title,
              description: post.description,
              creator_name: creator.name,
              created_at: post.created_at,
              pet_name: pet.name,
              pet_species: pet.species,
              pet_images: pet.images || post.images || []
            };
          });

        console.log('✅ Publicaciones activas:', formattedPosts.length);
        setPosts(formattedPosts);
        
        if (formattedPosts.length > 0) {
          setSelectedPostId(formattedPosts[0].id);
        }
      } else {
        setPosts([]);
      }
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message || 'Error al cargar publicaciones');
    } finally {
      setLoading(false);
    }
  };

  const currentPost = posts.find(p => p.id === selectedPostId);

  const handleAdoptClick = () => {
    if (!token) {
      alert('⚠️ Debes iniciar sesión para solicitar una adopción');
      return;
    }
    setShowAdoptionModal(true);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Hoy';
      if (diffDays === 1) return 'Hace 1 día';
      if (diffDays < 7) return `Hace ${diffDays} días`;
      if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
      
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Fecha desconocida';
    }
  };

  const getSpeciesEmoji = (species: string) => {
    const emojis: Record<string, string> = {
      dog: '🐕',
      cat: '🐈',
      bird: '🦜',
      rabbit: '🐰',
      other: '🐾'
    };
    return emojis[species] || '🐾';
  };

  if (loading) {
    return (
      <div className="page-container">
        <Header />
        <main className="main-content">
          <div style={{ 
            minHeight: '60vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ fontSize: '3rem' }}>🐾</div>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>Cargando publicaciones...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <Header />
        <main className="main-content">
          <div style={{ 
            minHeight: '60vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <div style={{ 
              padding: '2rem', 
              backgroundColor: '#fff3cd', 
              borderRadius: '12px',
              maxWidth: '500px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
              <h2 style={{ color: '#856404', marginBottom: '1rem' }}>Error al cargar</h2>
              <p style={{ color: '#856404', marginBottom: '1.5rem' }}>{error}</p>
              <button 
                onClick={loadPosts}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#FF6B35',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🔄 Reintentar
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="page-container">
        <Header />
        <main className="main-content">
          <div style={{ 
            minHeight: '60vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🐾</div>
              <h2 style={{ fontSize: '1.5rem', color: '#2c3e50', marginBottom: '0.5rem' }}>
                Sin publicaciones activas
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
                No hay publicaciones disponibles en este momento
              </p>
              {user && (
                <a 
                  href="/crear-post"
                  style={{
                    display: 'inline-block',
                    padding: '12px 32px',
                    backgroundColor: '#FF6B35',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '25px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
                  }}
                >
                  ➕ Crear publicación
                </a>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />

      <main className="main-content">
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '2rem 1.5rem'
        }}>
          {/* El resto del código permanece igual hasta los botones */}
          <div style={{marginBottom: '3rem', textAlign: 'center'}}>
            <h1 style={{fontSize: '2.5rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: '0.5rem'}}>
              Mascotas en Adopción
            </h1>
            <p style={{fontSize: '1.1rem', color: '#7f8c8d', margin: 0}}>
              Encuentra a tu nuevo mejor amigo
            </p>
          </div>

          {/* ... Grid y demás código permanece igual ... */}

          {currentPost && (
            <div style={{backgroundColor: 'white', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '3rem'}}>
              {/* ... Contenido del detalle ... */}
              
              <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                <button 
                  onClick={handleAdoptClick}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#FF6B35',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  💚 Quiero adoptarlo
                </button>
                
                <button style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'white',
                  color: '#FF6B35',
                  border: '2px solid #FF6B35',
                  borderRadius: '25px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  🔗 Compartir
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      
      {/* Modal de Solicitud de Adopción */}
      {currentPost && showAdoptionModal && (
        <CreateAdoptionRequestModal
          postId={currentPost.id}
          isOpen={showAdoptionModal}
          onClose={() => setShowAdoptionModal(false)}
          onSuccess={() => {
            alert('✅ Solicitud enviada exitosamente');
            setShowAdoptionModal(false);
          }}
          token={token || ''}
        />
      )}
    </div>
  );
};

export default PostPage;

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CommentsList from '../components/CommentsList';
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
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    
    const token = localStorage.getItem('authToken') || 
                  sessionStorage.getItem('authToken') || '';
    
    try {
      const response = await fetch(`${API_BASE_URL}/adoptions/publications?page=1&pageSize=100`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
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
          {/* Header de la sección */}
          <div style={{
            marginBottom: '3rem',
            textAlign: 'center'
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#2c3e50',
              marginBottom: '0.5rem'
            }}>
              Mascotas en Adopción
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: '#7f8c8d',
              margin: 0
            }}>
              Encuentra a tu nuevo mejor amigo
            </p>
          </div>

          {/* Grid de publicaciones */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPostId(post.id)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: selectedPostId === post.id ? '3px solid #FF6B35' : '1px solid #e0e0e0',
                  boxShadow: selectedPostId === post.id 
                    ? '0 8px 24px rgba(255, 107, 53, 0.2)' 
                    : '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  transform: selectedPostId === post.id ? 'translateY(-4px)' : 'translateY(0)'
                }}
                onMouseOver={(e) => {
                  if (selectedPostId !== post.id) {
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedPostId !== post.id) {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {/* Imagen de la mascota */}
                {post.pet_images && post.pet_images.length > 0 ? (
                  <div style={{
                    width: '100%',
                    height: '250px',
                    overflow: 'hidden',
                    backgroundColor: '#f5f5f5',
                    position: 'relative'
                  }}>
                    <img
                      src={post.pet_images[0]}
                      alt={post.pet_name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 4rem;">
                              ${getSpeciesEmoji(post.pet_species)}
                            </div>
                          `;
                        }
                      }}
                    />
                    {/* Badge de especie */}
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      {getSpeciesEmoji(post.pet_species)} {post.pet_species === 'dog' ? 'Perro' : post.pet_species === 'cat' ? 'Gato' : 'Mascota'}
                    </div>
                  </div>
                ) : (
                  <div style={{
                    width: '100%',
                    height: '250px',
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem'
                  }}>
                    {getSpeciesEmoji(post.pet_species)}
                  </div>
                )}

                {/* Contenido */}
                <div style={{ padding: '1.5rem' }}>
                  {/* Título */}
                  <h3 style={{
                    margin: '0 0 1rem 0',
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    color: '#2c3e50',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {post.pet_name}
                  </h3>

                  {/* Descripción */}
                  <p style={{
                    fontSize: '0.95rem',
                    color: '#555',
                    lineHeight: '1.6',
                    margin: '0 0 1.5rem 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {post.description}
                  </p>

                  {/* Footer con avatar y fecha */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #e9ecef'
                  }}>
                    <Avatar name={post.creator_name} size={36} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        margin: 0,
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        color: '#2c3e50',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {post.creator_name}
                      </p>
                      <p style={{
                        margin: '0.15rem 0 0 0',
                        fontSize: '0.8rem',
                        color: '#7f8c8d'
                      }}>
                        {formatDate(post.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detalle de la publicación seleccionada */}
          {currentPost && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '2.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              marginBottom: '3rem'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
                gap: '3rem',
                marginBottom: '3rem'
              }}>
                {/* Imagen grande */}
                <div>
                  {currentPost.pet_images && currentPost.pet_images.length > 0 ? (
                    <div style={{
                      width: '100%',
                      height: '400px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      backgroundColor: '#f5f5f5'
                    }}>
                      <img
                        src={currentPost.pet_images[0]}
                        alt={currentPost.pet_name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 6rem;">
                                ${getSpeciesEmoji(currentPost.pet_species)}
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '400px',
                      borderRadius: '16px',
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '6rem'
                    }}>
                      {getSpeciesEmoji(currentPost.pet_species)}
                    </div>
                  )}
                </div>

                {/* Información */}
                <div>
                  <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    marginBottom: '1rem'
                  }}>
                    {currentPost.title}
                  </h1>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    <Avatar name={currentPost.creator_name} size={50} />
                    <div>
                      <p style={{
                        margin: 0,
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        color: '#2c3e50'
                      }}>
                        {currentPost.creator_name}
                      </p>
                      <p style={{
                        margin: '0.25rem 0 0 0',
                        fontSize: '0.9rem',
                        color: '#7f8c8d'
                      }}>
                        {formatDate(currentPost.created_at)}
                      </p>
                    </div>
                  </div>

                  <div style={{
                    display: 'inline-block',
                    backgroundColor: '#f0f0f0',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    marginBottom: '1.5rem'
                  }}>
                    {getSpeciesEmoji(currentPost.pet_species)} {currentPost.pet_name}
                  </div>

                  <p style={{
                    fontSize: '1.05rem',
                    lineHeight: '1.7',
                    color: '#444',
                    marginBottom: '2rem'
                  }}>
                    {currentPost.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap'
                  }}>
                    <button style={{
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
                    }}>
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
              </div>

              {/* Sección de comentarios */}
              <div style={{
                borderTop: '2px solid #f0f0f0',
                paddingTop: '2rem'
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '1.5rem',
                  color: '#2c3e50'
                }}>
                  Comentarios
                </h2>
                <CommentsList 
                  postId={currentPost.id}
                  AvatarComponent={Avatar}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostPage;

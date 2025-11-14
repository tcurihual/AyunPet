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
  pet_images?: string[];
}

const API_BASE_URL = 'http://ayunpet-api.eastus2.cloudapp.azure.com/v1';

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
    
    // ✅ Mismo patrón que VistaNoticias
    const token = localStorage.getItem('authToken') || '';
    
    try {
      const response = await fetch(`${API_BASE_URL}/adoptions/publications`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // ✅ Verificar si la respuesta es OK
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📦 Respuesta completa del servidor:', result);

      // ✅ Adaptar la estructura según la respuesta real
      if (result.data && Array.isArray(result.data)) {
        const formattedPosts: Post[] = result.data.map((pub: any) => ({
          id: pub.id,
          title: pub.title || 'Sin título',
          description: pub.description || 'Sin descripción',
          creator_name: pub.creator_name || 'Usuario',
          created_at: pub.created_at || new Date().toISOString(),
          pet_images: pub.pet_images || []
        }));

        setPosts(formattedPosts);
        
        if (formattedPosts.length > 0 && !selectedPostId) {
          setSelectedPostId(formattedPosts[0].id);
        }
      } else {
        setPosts([]);
      }
    } catch (err: any) {
      console.error('❌ Error loading posts:', err);
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
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Hoy';
      if (diffDays === 1) return 'Ayer';
      if (diffDays < 7) return `Hace ${diffDays} días`;
      if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
      
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Header />
        <main className="main-content">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando publicaciones...</p>
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
          <div className="post-page-wrapper">
            <div className="error-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h2 style={{ color: '#e74c3c', marginBottom: '20px' }}>⚠️ Error</h2>
              <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '20px' }}>
                {error}
              </p>
              <button 
                onClick={loadPosts} 
                className="btn btn-primary"
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
          <div className="post-page-wrapper">
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>📋 Sin publicaciones</h2>
              <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '30px' }}>
                🐾 No hay publicaciones disponibles en este momento
              </p>
              {user && (
                <a href="/crear-post" className="btn btn-primary">
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
        <div className="post-page-wrapper">
          {/* Selector de Posts */}
          <div className="post-selector">
            <p className="post-selector-label">Selecciona una publicación:</p>
            <div className="post-selector-buttons">
              {posts.map(post => (
                <button
                  key={post.id}
                  onClick={() => setSelectedPostId(post.id)}
                  className={`post-selector-btn ${selectedPostId === post.id ? 'active' : ''}`}
                >
                  {post.title.length > 20 ? post.title.substring(0, 20) + '...' : post.title}
                </button>
              ))}
            </div>
          </div>

          {/* Article Card */}
          {currentPost && (
            <>
              <article className="post-article-card">
                {/* Imagen del lado izquierdo */}
                <div className="post-image-section">
                  <div className="post-image-circle-wrapper">
                    {currentPost.pet_images && currentPost.pet_images.length > 0 ? (
                      <img 
                        src={currentPost.pet_images[0]}
                        alt={currentPost.title}
                        className="post-image-circle"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '80px',
                        background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
                      }}>
                        🐾
                      </div>
                    )}
                  </div>
                  
                  {/* Elementos decorativos */}
                  <div className="decorative-circle decorative-circle-1"></div>
                  <div className="decorative-circle decorative-circle-2"></div>
                </div>

                {/* Contenido del lado derecho */}
                <div className="post-content-section">
                  <h1 className="post-title">{currentPost.title}</h1>

                  <div className="post-meta">
                    <span className="post-author">
                      Por <strong>{currentPost.creator_name}</strong>
                    </span>
                    <span className="post-meta-separator">•</span>
                    <span className="post-date">{formatDate(currentPost.created_at)}</span>
                  </div>

                  <div className="post-body">
                    <p>{currentPost.description}</p>
                  </div>

                  <div className="post-actions">
                    <button className="btn btn-primary btn-adopt">
                      💚 Quiero adoptarlo
                    </button>
                    
                    <button className="btn btn-outline">
                      🔗 Compartir
                    </button>
                  </div>
                </div>
              </article>

              <CommentsList postId={currentPost.id} />
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostPage;
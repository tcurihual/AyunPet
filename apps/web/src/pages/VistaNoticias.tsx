import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getAllNews, News } from '../lib/newsService';
import { useAuth } from '../context/AuthContext';
import './VistaNoticias.css';

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1518715308788-3005759c61e9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1502672023488-70e25813f145?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&h=600&fit=crop',
];

const NEWS_PER_PAGE = 6;

const VistaNoticias: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [visibleCount, setVisibleCount] = useState(NEWS_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('authToken') || '';
    const result = await getAllNews(token);

    if (result.ok && result.data) {
      const activeNews = result.data.filter((n) => n.status === 'active');
      setNews(activeNews);
    } else {
      setError(result.error || 'Error al cargar noticias');
    }
    setLoading(false);
  };

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
      return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  // Rotar imágenes por defecto para variedad
  const getDefaultImage = (index: number = 0) => {
    return DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];
  };

  // Paginación: mostrar más noticias
  const handleLoadMore = () => {
    if (visibleCount < news.length) {
      setVisibleCount((c) => Math.min(news.length, c + NEWS_PER_PAGE));
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Header />
        <main className="news-page-container">
          <div className="news-header">
            <h1 className="news-title">Noticias y Novedades</h1>
            <p className="news-subtitle">Mantente informado sobre el mundo de las adopciones</p>
          </div>
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando noticias...</p>
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
        <main className="news-page-container">
          <div className="news-header">
            <h1 className="news-title">Noticias y Novedades</h1>
            <p className="news-subtitle">Mantente informado sobre el mundo de las adopciones</p>
          </div>
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={loadNews} className="retry-button">Reintentar</button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />
      <main className="news-page-container">
        <div className="news-header">
          <h1 className="news-title">Noticias y Novedades</h1>
          <p className="news-subtitle">Mantente informado sobre el mundo de las adopciones</p>
        </div>

        {news.length === 0 ? (
          <div className="empty-state">
            <p>📰 No hay noticias disponibles en este momento</p>
          </div>
        ) : (
          <>
            <div className="news-grid">
              {news.slice(0, visibleCount).map((article, idx) => (
                <article key={article.id} className="news-card">
                  <div className="news-card-image-wrapper">
                    <img
                      src={article.images && article.images.length > 0 ? article.images[0] : getDefaultImage(idx)}
                      alt={article.title}
                      className="news-card-image"
                      onError={(e) => { e.currentTarget.src = getDefaultImage(idx); }}
                    />
                  </div>
                  <div className="news-card-content">
                    <span className="news-card-category">
                      {article.date ? 'Evento' : 'Noticia'}
                    </span>
                    <h3 className="news-card-title">{article.title}</h3>
                    <p className="news-card-excerpt">{article.description}</p>

                    {article.date && (
                      <div className="news-event-info highlight-event">
                        <span className="news-event-date">
                          📅 <span className="event-date-text">{new Date(article.date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                        </span>
                        {article.start_time && article.end_time && (
                          <span className="news-event-time">
                            🕒&nbsp;<span className="event-time-text">{article.start_time} - {article.end_time}</span>
                          </span>
                        )}
                      </div>
                    )}

                    <div className="news-card-meta">
                      <span className="news-card-date">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 6v6l4 2"/>
                        </svg>
                        {formatDate(article.created_at)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {(visibleCount < news.length) && (
              <div style={{ textAlign: 'center', margin: '40px 0' }}>
                <button className="btn btn-submit" onClick={handleLoadMore}>
                  Cargar más noticias
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default VistaNoticias;

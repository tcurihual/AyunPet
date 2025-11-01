import React from 'react';
import './VistaNoticias.css';

interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  imageUrl: string;
}

const VistaNoticias: React.FC = () => {
  // Datos de ejemplo para las noticias
  const newsArticles: NewsArticle[] = [
    {
      id: 1,
      title: "Max encuentra su hogar perfecto",
      excerpt: "Después de 6 meses en nuestro refugio, Max finalmente ha encontrado una familia amorosa que lo adoptó. Una historia con final feliz que nos llena de alegría.",
      category: "Adopciones",
      author: "María González",
      date: "Hace 2 días",
      imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=600&fit=crop"
    },
    {
      id: 2,
      title: "Guía completa para adoptar un gato",
      excerpt: "Todo lo que necesitas saber antes de adoptar un gato: desde preparar tu hogar hasta entender su comportamiento y necesidades básicas.",
      category: "Consejos",
      author: "Dr. Carlos Ruiz",
      date: "Hace 4 días",
      imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=600&fit=crop"
    },
    {
      id: 3,
      title: "Feria de Adopción este fin de semana",
      excerpt: "Te invitamos a nuestra feria de adopción en el parque central. Habrá más de 30 mascotas buscando un hogar y actividades para toda la familia.",
      category: "Eventos",
      author: "Equipo Adopciones",
      date: "Hace 1 semana",
      imageUrl: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=600&fit=crop"
    },
    {
      id: 4,
      title: "Luna: De las calles al amor incondicional",
      excerpt: "La emotiva historia de Luna, una perrita rescatada que superó todos los obstáculos y ahora vive feliz con su nueva familia adoptiva.",
      category: "Historias",
      author: "Ana Martínez",
      date: "Hace 1 semana",
      imageUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop"
    },
    {
      id: 5,
      title: "Primeros días con tu mascota adoptada",
      excerpt: "Consejos esenciales para hacer que la transición de tu nueva mascota sea lo más suave y feliz posible durante sus primeros días en casa.",
      category: "Consejos",
      author: "Laura Pérez",
      date: "Hace 2 semanas",
      imageUrl: "https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800&h=600&fit=crop"
    },
    {
      id: 6,
      title: "5 cachorros rescatados buscan hogar",
      excerpt: "Acabamos de rescatar una camada de 5 adorables cachorros que necesitan urgentemente familias responsables que los adopten y les den una segunda oportunidad.",
      category: "Adopciones",
      author: "Refugio Animal",
      date: "Hace 3 semanas",
      imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop"
    }
  ];

  return (
    <div className="news-page-container">
      <div className="news-header">
        <h1 className="news-title">Noticias y Novedades</h1>
        <p className="news-subtitle">Mantente informado sobre el mundo de las adopciones</p>
      </div>

      <div className="news-grid">
        {newsArticles.map((article) => (
          <article key={article.id} className="news-card">
            <div className="news-card-image-wrapper">
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="news-card-image"
              />
            </div>
            <div className="news-card-content">
              <span className="news-card-category">{article.category}</span>
              <h3 className="news-card-title">{article.title}</h3>
              <p className="news-card-excerpt">{article.excerpt}</p>
              <div className="news-card-meta">
                <span className="news-card-date">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  {article.date}
                </span>
                <span className="news-card-author">{article.author}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default VistaNoticias;
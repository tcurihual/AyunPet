import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CommentsList from '../components/CommentsList';

const mockPosts = [
  {
    id: 1,
    title: 'Perrito busca hogar 🐶',
    content: 'Este adorable cachorro fue rescatado y está buscando una familia amorosa. Tiene 4 meses, es muy juguetón y se lleva bien con otros animales. Es perfecto para familias con niños y otros perros.',
    author: 'María García',
    date: '2025-10-10',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
  },
  {
    id: 2,
    title: 'Gatito rescatado necesita familia 🐱',
    content: 'Hermoso gatito de 6 meses, muy cariñoso y tranquilo. Fue encontrado en la calle y ahora está listo para encontrar su hogar definitivo. Ya está esterilizado y vacunado.',
    author: 'Juan Pérez',
    date: '2025-10-11',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80',
  },
  {
    id: 3,
    title: 'Labrador adulto busca nuevo hogar 🦮',
    content: 'Max es un labrador de 3 años, muy educado y sociable. Su familia tuvo que mudarse y no pudo llevarlo. Es perfecto para personas activas que disfruten del ejercicio al aire libre.',
    author: 'Ana Rodríguez',
    date: '2025-10-12',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80',
  },
];

const PostPage: React.FC = () => {
  const [selectedPostId, setSelectedPostId] = useState(1);
  const currentPost = mockPosts.find(p => p.id === selectedPostId) || mockPosts[0];

  return (
    <div className="page-container">
      <Header />

      <main className="main-content">
        <div className="post-page-wrapper">
          <div className="post-selector">
            <p className="post-selector-label">Selecciona una publicación:</p>
            <div className="post-selector-buttons">
              {mockPosts.map(post => (
                <button
                  key={post.id}
                  onClick={() => setSelectedPostId(post.id)}
                  className={`post-selector-btn ${selectedPostId === post.id ? 'active' : ''}`}
                >
                  {post.title.split(' ')[0]} {post.title.match(/[🐶🐱🦮]/)?.[0]}
                </button>
              ))}
            </div>
          </div>

          <article className="post-article-card">
            <div className="post-image-section">
              <div className="post-image-circle-wrapper">
                <img 
                  src={currentPost.image}
                  alt={currentPost.title}
                  className="post-image-circle"
                />
              </div>
              
              <div className="decorative-circle decorative-circle-1"></div>
              <div className="decorative-circle decorative-circle-2"></div>
            </div>

            <div className="post-content-section">
              <h1 className="post-title">{currentPost.title}</h1>

              <div className="post-meta">
                <span className="post-author">
                  Por <strong>{currentPost.author}</strong>
                </span>
                <span className="post-meta-separator">•</span>
                <span className="post-date">{currentPost.date}</span>
              </div>

              <div className="post-body">
                <p>{currentPost.content}</p>
              </div>

              <div className="post-actions">
                <button className="btn btn-primary btn-adopt">
                  Quiero adoptarlo
                </button>
                
                <button className="btn btn-outline">
                  Compartir
                </button>
              </div>
            </div>
          </article>

          <CommentsList postId={currentPost.id} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostPage;
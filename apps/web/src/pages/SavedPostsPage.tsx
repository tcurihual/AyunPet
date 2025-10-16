import Header from "../components/Header";
import Footer from "../components/Footer";

const SavedPostsPage: React.FC = () => {
  const savedPosts = [
    {
      id: 1,
      title: "El maxi",
      description: "Cachorra mestizo de 5 meses, muy cariñoso y juguetono, juega clash y marvel rivals.",
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&q=80",
    },
    {
      id: 2,
      title: "el pepe",
      description: "De tamaño mediano, vacunado y esterilizado. Ideal para casa con patio.",
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80",
    },
    {
      id: 3,
      title: "Nose",
      description: "adoptame vro .",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80",
    },
        {
      id: 3,
      title: "Minecraft",
      description: "juguemos vanilla mejor, muchos mods me confunde.",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80",
    }
  ];

  return (
    <div className="page-container">
      <Header />

      <main className="main-content">
        <div className="saved-posts-container">
          <h1 className="saved-posts-title">Mis Favoritos</h1>

          {savedPosts.length === 0 ? (
            <p className="saved-posts-empty">
              No tienes publicaciones guardadas aún.
            </p>
          ) : (
            <div className="saved-posts-grid">
              {savedPosts.map((post) => (
                <article key={post.id} className="saved-post-card">
                  <div className="saved-post-image-wrapper">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="saved-post-image"
                    />
                    <div className="favorite-badge">💖</div>
                  </div>
                  
                  <div className="saved-post-content">
                    <div>
                      <h2 className="saved-post-title">{post.title}</h2>
                      <p className="saved-post-description">{post.description}</p>
                    </div>
                    <button className="btn-remove-favorite">
                      Quitar de favoritos
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SavedPostsPage;
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";


const SavedPostsPage: React.FC = () => {
  const savedPosts = [
    {
      id: 1,
      title: "Luna necesita un hogar 🐾",
      description: "Cachorra mestiza de 5 meses, muy cariñosa y juguetona.",
      image: "https://placekitten.com/400/260",
    },
    {
      id: 2,
      title: "Max, un perro rescatado busca familia 💛",
      description: "De tamaño mediano, vacunado y esterilizado. Ideal para casa con patio.",
      image: "https://place-puppy.com/400x260",
    },
  ];

  return (
    <div className="page-container">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">Mis Favoritos 💖</h1>

        {savedPosts.length === 0 ? (
          <p className="text-center text-gray-500">
            No tienes publicaciones guardadas aún.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 flex-grow">{post.description}</p>
                <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                  Quitar de favoritos
                </button>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SavedPostsPage;

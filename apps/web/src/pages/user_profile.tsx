import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom'; 

export default function Profile() {
  const user = {
    nombre: "jose",
    rut: "12.345.678-9",
    email: "aaaaaa@example.com",
    telefono: "+56 9 1234 5678",
    ciudad: "Temuco",
    direccion: "desconocido 2020",
    bio: "Amante de los animales, voluntaria en rescates y hogar temporal.",
    intereses: ["Perros", "Gatos", "Adopción", "Voluntariado"],
    estadisticas: { adopciones: 3, favoritos: 8, publicaciones: 2 },
    rol: "tester", 
  };

  return (
    <div className="page-container">
      <Header />

      <div className="userprof-page">
        <div className="userprof-container">
          <main className="userprof-main">
            <header className="userprof-header">
              <div className="userprof-avatar">{user.nombre[0]}</div>
              <div className="userprof-info">
                <h2>{user.nombre}</h2>
                <p>RUT: {user.rut}</p>
              </div>
            </header>

            <div className="userprof-stats-bar">
              <div className="userprof-stat-item">
                <strong>{user.estadisticas.adopciones}</strong>
                Adopciones
              </div>
              <div className="userprof-stat-item">
                <strong>{user.estadisticas.favoritos}</strong>
                Favoritos
              </div>
              <div className="userprof-stat-item">
                <strong>{user.estadisticas.publicaciones}</strong>
                Publicaciones
              </div>
            </div>

            <section className="userprof-card">
              <h3>Sobre mí</h3>
              <p>{user.bio}</p>
            </section>
          </main>

          <aside className="userprof-sidebar">
            <div className="userprof-card">
              <h3>Contacto</h3>
              <p>Email: {user.email}</p>
              <p>Teléfono: {user.telefono}</p>
              <p>Ciudad: {user.ciudad}</p>
              <p>Dirección: {user.direccion}</p>
            </div>

          <div className="userprof-card">
            <h3>Accesos rápidos</h3>
            <Link to="/favoritos" className="userprof-quick-link">Mis favoritos</Link>
            <Link to="/crear-post" className="userprof-quick-link">Mis publicaciones</Link>
            <Link to="/solicitudes" className="userprof-quick-link">Solicitudes</Link>
            {(user.rol === "admin" || user.rol === "tester") && (
              <Link to="/admin/reportes" className="userprof-quick-link admin-link">
                Ver reportes
              </Link>
            )}


          </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
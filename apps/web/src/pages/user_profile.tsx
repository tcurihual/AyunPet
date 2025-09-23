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
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <main className="profile-main">
          <header className="profile-header">
            <div className="profile-avatar">{user.nombre[0]}</div>
            <div className="profile-info">
              <h2>{user.nombre}</h2>
              <p>RUT: {user.rut}</p>
            </div>
          </header>

          <div className="stats-bar">
            <div className="stat-item">
              <strong>{user.estadisticas.adopciones}</strong>
              Adopciones
            </div>
            <div className="stat-item">
              <strong>{user.estadisticas.favoritos}</strong>
              Favoritos
            </div>
            <div className="stat-item">
              <strong>{user.estadisticas.publicaciones}</strong>
              Publicaciones
            </div>
          </div>

          <section className="card">
            <h3>Sobre mí</h3>
            <p>{user.bio}</p>
          </section>
        </main>

        <aside className="profile-sidebar">
          <div className="card">
            <h3>Contacto</h3>
            <p>Email: {user.email}</p>
            <p>Teléfono: {user.telefono}</p>
            <p>Ciudad: {user.ciudad}</p>
            <p>Dirección: {user.direccion}</p>
          </div>

          <div className="card">
            <h3>Accesos rápidos</h3>
            <a className="quick-link" href="#">Mis favoritos</a>
            <a className="quick-link" href="#">Mis publicaciones</a>
            <a className="quick-link" href="#">Solicitudes</a>
          </div>
        </aside>
      </div>
    </div>
  );
}
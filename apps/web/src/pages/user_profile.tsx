import { Link } from "react-router-dom";

export default function Profile() {
  const user = {
    nombre: "el papu",
    rut: "12.345.678-9",
    email: "aaaaaa@example.com",
    telefono: "+56 9 1234 5678",
    ciudad: "Temuco",
    direccion: "nose",
    bio: "Amante de los animales, voluntaria en rescates y hogar temporal.",
    intereses: ["Perros", "Gatos", "Adopción", "Voluntariado"],
    estadisticas: { adopciones: 3, favoritos: 8, publicaciones: 2 },
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="relative h-40 w-full bg-gradient-to-r from-blue-500 to-indigo-500" aria-hidden />

      <section className="mx-auto -mt-14 w-full max-w-5xl px-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex items-center gap-4">
              <div
                className="grid h-24 w-24 place-items-center rounded-full border-4 border-white bg-neutral-100 text-3xl font-bold shadow-sm"
                aria-label="Avatar"
                role="img"
              >
                {user.nombre.split(" ").slice(0,2).map(s=>s[0]).join("")}
              </div>
              <div>
                <h1 className="text-2xl font-semibold">{user.nombre}</h1>
                <p className="text-sm text-neutral-500">RUT: {user.rut}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-700 ring-1 ring-neutral-200 hover:bg-neutral-50"
                type="button"
              >
                Compartir perfil
              </button>
              <button
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                type="button"
              >
                Editar perfil
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 divide-x rounded-xl border bg-neutral-50 text-center text-sm">
            <Stat label="Adopciones" value={user.estadisticas.adopciones} />
            <Stat label="Favoritos" value={user.estadisticas.favoritos} />
            <Stat label="Publicaciones" value={user.estadisticas.publicaciones} />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 w-full max-w-5xl px-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="col-span-2 space-y-6">
            <Card title="Sobre mí">
              <p className="text-sm leading-relaxed text-neutral-700">{user.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {user.intereses.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-100"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Card>

            <Card title="Historial de adopciones">
              <ul className="grid gap-3 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 rounded-xl border p-3 hover:bg-neutral-50"
                  >
                    <div className="h-12 w-12 rounded-lg bg-neutral-100" aria-hidden />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">Mascota #{i + 1}</p>
                      <p className="truncate text-xs text-neutral-500">Adoptado • 2024-0{i + 1}-12</p>
                    </div>
                    <Link
                      to="#"
                      className="ml-auto text-xs font-medium text-blue-600 hover:underline"
                    >
                      Ver
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Información de contacto">
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Teléfono" value={user.telefono} />
              <InfoRow label="Ciudad" value={user.ciudad} />
              <InfoRow label="Dirección" value={user.direccion} />
            </Card>

            <Card title="Accesos rápidos">
              <div className="grid gap-2">
                <Link className="quick-link" to="#">Mis favoritos</Link>
                <Link className="quick-link" to="#">Mis publicaciones</Link>
                <Link className="quick-link" to="#">Solicitudes</Link>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4">
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-xs text-neutral-500">{label}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-100">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-600">
          {title}
        </h2>
      </header>
      {children}
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b py-3 last:border-b-0">
      <span className="text-xs font-medium text-neutral-500">{label}</span>
      <span className="max-w-[65%] text-sm text-neutral-800">{value}</span>
    </div>
  );
}
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-dvh flex flex-col bg-gray-50">
      {/*Barrita superior*/}
      <nav className="h-14 md:h-16 w-full bg-[#FBDBA8] px-4 md:px-6 sticky top-0 z-10 shadow-sm">
        <div className="w-full h-full flex items-center justify-between">
          <div className="flex items-center">
            <img src="/logo.png" alt="Ayün Pet" className="h-10 w-10" />
          </div>
          <div className="flex gap-8">
            <Link to="/adopta" className="text-sm text-[#281402] hover:underline">Adopta</Link>
            <Link to="/refugios" className="text-sm text-[#281402] hover:underline">Refugios y Organizaciones</Link>
            <Link to="/nosotros" className="text-sm text-[#281402] hover:underline">Nosotros</Link>
            <Link to="/solicitudes" className="text-sm text-[#281402] hover:underline">Solicitudes</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login" className="rounded-lg bg-[#281402] text-sm text-white px-3 py-1.5 hover:bg-[#644C34]">Iniciar Sesión</Link>
            <Link to="/register" className="rounded-lg bg-[#281402] text-white px-3 py-1.5 text-sm hover:bg-[#644C34]">Registrarse</Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-6xl mx-auto py-8 px-4 grid place-items-center">
        <Outlet />
      </main>

      {/*Barrita inferior*/}
      <footer className="h-12 w-full bg-[#281402] flex items-center px-6">
        <img src="/logo.png" alt="Ayün Pet" className="h-10 w-10" />
      </footer>
    </div>
  );
}
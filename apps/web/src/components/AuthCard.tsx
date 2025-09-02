import type { ReactNode } from "react"
import { Link } from "react-router-dom"

type Props = {
  title: string
  subtitle?: string
  children: ReactNode
}

export default function AuthCard({ title, subtitle, children }: Props) {
  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <nav className="h-14 md:h-16 w-full bg-[#FBDBA8]">
        <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/logo.png" alt="Ayün Pet" className="h-8 w-8" />
          </div>

          <div className="flex-1 flex justify-center gap-8">
            <Link to="/adopta" className="text-sm text-[#281402] hover:underline">
              Adopta
            </Link>
            <Link to="/refugios" className="text-sm text-[#281402] hover:underline">
              Refugios y Organizaciones
            </Link>
            <Link to="/nosotros" className="text-sm text-[#281402] hover:underline">
              Nosotros
            </Link>
          </div>

          <div className="flex gap-2">
            <Link
              to="/login"
              className="rounded-lg bg-[#281402] text-white px-3 py-1.5 text-sm hover:bg-[#644C34]"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-[#281402] text-white px-3 py-1.5 text-sm hover:bg-[#644C34]"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 grid place-items-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-lg p-8 border border-[#E5D5BE]">
          <div className="mb-6 text-center">
            <img src="/logo.png" alt="Ayün Pet" className="mx-auto h-12 mb-2" />
            <h1 className="text-2xl font-semibold tracking-tight text-[#281402]">{title}</h1>
            {subtitle && <p className="text-sm text-[#644C34] mt-1">{subtitle}</p>}
          </div>
          {children}
        </div>
      </main>

      <footer className="h-12 w-full bg-[#281402] mt-auto flex items-center px-6">
        <img src="/logo.png" alt="Ayün Pet" className="h-8" />
      </footer>
    </div>
  )
}

import { Link } from "react-router-dom"
import AuthCard from "../components/AuthCard"
import TextField from "../components/TextField"

export default function Login() {

  return (
    <AuthCard title="Iniciar sesión" subtitle="Bienvenido a Ayün Pet">
      <form className="space-y-2">
        <TextField
          label="Correo electrónico"
          type="email"
          placeholder="ejemplo@correo.com"
          name="email" 
        />
        <TextField
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          name="password"
        />
        <button
          type="submit"
          className="w-full rounded-xl bg-[#281402] text-white py-2.5 font-medium hover:bg-[#644C34] active:scale-[.99] transition"
        >
          Ingresar
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-slate-600">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="text-[#281402] hover:underline">Crear cuenta</Link>
      </div>
    </AuthCard>
  )
}
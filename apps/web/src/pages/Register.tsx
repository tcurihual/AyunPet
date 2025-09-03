import { Link } from "react-router-dom"
import AuthCard from "../components/AuthCard"
import TextField from "../components/TextField"

export default function Register() {

  return (
    <AuthCard title="Crea tu cuenta" subtitle="Únete a Ayün Pet">
      <form className="space-y-2">
        <TextField 
          label="Nombre completo" 
          placeholder="Héctor Orlando Lepio Madrid" 
          name="name" 
        />
        <TextField 
          label="Correo electrónico" 
          type="email" 
          placeholder="hlepio2024@alu.uct.cl" 
          name="email" 
        />
        <TextField 
          label="RUT" 
          placeholder="21916832-2" 
          name="rut" 
        />
        <TextField 
          label="Contraseña" 
          type="password" 
          placeholder="••••••••" 
          name="password" 
        />
        <TextField 
          label="Confirmar contraseña" 
          type="password" 
          placeholder="••••••••" 
          name="confirm" 
        />

        <label className="flex items-start gap-2 text-sm text-slate-700 mt-2">
          <input type="checkbox" className="mt-1 size-4" name="accept" />
          <span>
            Acepto los términos y condiciones y la política de privacidad.
          </span>
        </label>

        <button
          type="submit"
          className="w-full rounded-xl bg-[#281402] text-white py-2.5 font-medium hover:bg-[#644C34] active:scale-[.99] transition mt-1"
        >
          Registrarse
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-slate-600">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="text-[#281402] hover:underline">Iniciar sesión</Link>
      </div>
    </AuthCard>
  )
}
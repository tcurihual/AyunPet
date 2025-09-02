import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import AuthCard from "../components/AuthCard"
import TextField from "../components/TextField"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const rutRegex = /^[0-9]{7,8}-[0-9kK]$/

const registerSchema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  email: z.string().email("Correo inválido"),
  rut: z.string().regex(rutRegex, "RUT inválido (formato: 12345678-9)"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  confirm: z.string().min(6, "Mínimo 6 caracteres"),
  accept: z.boolean().refine(val => val === true, {
  message: "Debes aceptar los términos"
})

}).refine((data) => data.password === data.confirm, {
  message: "Las contraseñas no coinciden",
  path: ["confirm"]
})

type RegisterInput = z.infer<typeof registerSchema>

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", rut: "", password: "", confirm: "", accept: false }
  })

  const onSubmit = async (data: RegisterInput) => {
    // TODO: integrar con backend
    const fakeToken = "eyJhbGciOi...fake.jwt.token"
    const fakeUser = { id: "1", name: data.name, email: data.email }
    login(fakeToken, fakeUser)
    navigate("/")
  }

  return (
    <AuthCard title="Crea tu cuenta" subtitle="Únete a Ayün Pet">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <TextField label="Nombre completo" placeholder="Héctor Orlando Lepio Madrid" {...register("name")} error={errors.name?.message} />
        <TextField label="Correo electrónico" type="email" placeholder="ejemplo@correo.com" {...register("email")} error={errors.email?.message} />
        <TextField label="RUT" placeholder="12345678-9" {...register("rut")} error={errors.rut?.message} />
        <TextField label="Contraseña" type="password" placeholder="••••••••" {...register("password")} error={errors.password?.message} />
        <TextField label="Confirmar contraseña" type="password" placeholder="••••••••" {...register("confirm")} error={errors.confirm?.message} />

        <label className="flex items-start gap-2 text-sm text-slate-700 mt-2">
          <input type="checkbox" className="mt-1 size-4" {...register("accept")} />
          <span>
            Acepto los términos y condiciones y la política de privacidad.
            {errors.accept && <span className="block text-rose-600">{errors.accept.message}</span>}
          </span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-[#281402] text-white py-2.5 font-medium hover:bg-[#644C34] active:scale-[.99] transition disabled:opacity-60 mt-1"
        >
          {isSubmitting ? "Creando..." : "Registrarse"}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-slate-600">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="text-[#281402] hover:underline">Iniciar sesión</Link>
      </div>
    </AuthCard>
  )
}

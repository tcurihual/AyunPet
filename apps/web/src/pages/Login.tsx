import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import AuthCard from "../components/AuthCard"
import TextField from "../components/TextField"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres")
})

type LoginInput = z.infer<typeof loginSchema>

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  })

  const onSubmit = async (data: LoginInput) => {
    // TODO: integrar con backend: const res = await fetch(...)
    // Simulación de respuesta:
    const fakeToken = "eyJhbGciOi...fake.jwt.token"
    const fakeUser = { id: "1", name: "Usuario", email: data.email }
    login(fakeToken, fakeUser)
    navigate("/")
  }

  return (
    <AuthCard title="Iniciar sesión" subtitle="Bienvenido a Ayün Pet">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <TextField
          label="Correo electrónico"
          type="email"
          placeholder="ejemplo@correo.com"
          {...register("email")}
          error={errors.email?.message}
        />
        <TextField
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          error={errors.password?.message}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-[#281402] text-white py-2.5 font-medium hover:bg-[#644C34] active:scale-[.99] transition disabled:opacity-60"
        >
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-slate-600">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="text-[#281402] hover:underline">Crear cuenta</Link>
      </div>
    </AuthCard>
  )
}

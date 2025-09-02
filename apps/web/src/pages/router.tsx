import React from "react"
import { Routes, Route, Navigate, Link } from "react-router-dom"
import Login from "./Login"
import Register from "./Register"

const Home: React.FC = () => {
  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <main className="flex-1 grid place-items-center px-4 py-10">
        <div className="text-center">
          <img src="/logo.png" alt="Ayün Pet" className="mx-auto h-28 mb-6" />
          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="rounded-lg bg-[#281402] text-white px-6 py-2 text-lg hover:bg-[#644C34]"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-[#281402] text-white px-6 py-2 text-lg hover:bg-[#644C34]"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

const WebRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default WebRouter

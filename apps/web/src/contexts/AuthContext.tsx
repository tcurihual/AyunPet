import { createContext, useContext, useEffect, useMemo, useState } from "react"

type User = {
  id: string
  name: string
  email: string
  role?: "USER" | "ORG" | "ADMIN"
}

type AuthContextType = {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isAuthenticated: boolean
  checkToken: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const t = localStorage.getItem("token")
    const u = localStorage.getItem("user")
    if (t && u) {
      setToken(t)
      try {
        setUser(JSON.parse(u))
      } catch {
        localStorage.removeItem("user")
      }
    }
  }, [])

  const login = (t: string, u: User) => {
    setToken(t)
    setUser(u)
    localStorage.setItem("token", t)
    localStorage.setItem("user", JSON.stringify(u))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  const checkTokenLocal = () => {
    if (!token) return false
    const parts = token.split(".")
    if (parts.length !== 3) return false
    try {
      const payload = JSON.parse(atob(parts[1]))
      if (payload?.exp && Date.now() / 1000 > payload.exp) {
        return false
      }
      return true
    } catch {
      return false
    }
  }

  const checkToken = async () => {
    return checkTokenLocal()
  }

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      isAuthenticated: Boolean(user && token),
      checkToken
    }),
    [user, token]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { useLoading } from "./LoadingContext";
import { type LoginData, type RegisterData } from "../lib/schemas";

interface User {
  id: string;
  name: string;
  email: string;
  role: "normal" | "institution" | "tester";
  rut?: string;
  address?: string;
  description?: string;
}

interface AuthContextType {
  user: User | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const { setLoading } = useLoading();
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // URLs corregidas para apuntar al gateway local
  const API_URL = "http://localhost:3001/v1/auth/login";
  const REGISTER_API_URL = "http://localhost:3001/v1/auth/register";

  const login = async (data: LoginData) => {
    setLoading(true);
    try {
      console.log("[AUTH] Intentando login con:", { email: data.email });
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("[AUTH] Respuesta del login:", result);
      
      if (!response.ok) {
        throw new Error(result.message || "Error al iniciar sesión");
      }
      if (!result.data || !result.data.token || !result.data.user) {
        throw new Error("Formato inesperado de respuesta del servidor.");
      }
      const { token, user } = result.data;
      const mappedRole = mapRole(user.role);
      const mappedUser: User = {
        id: String(user.id),
        name: user.name,
        email: user.email,
        rut: user.rut,
        role: mappedRole,
        address: user.address,
        description: user.description,
      };
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(mappedUser));
      setUser(mappedUser);
    } catch (err: any) {
      console.error("❌ Error en login:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    try {
      console.log("[AUTH] Preparando datos para registro:", {
        fullName: data.fullName,
        email: data.email,
        rut: data.rut,
        address: data.address,
        description: data.description,
      });
      
      const payload = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        rut: data.rut,
        address: data.address,
        description: data.description,
      };
      
      console.log("[AUTH] Enviando registro a:", REGISTER_API_URL);
      console.log("[AUTH] Payload:", payload);
      
      const response = await fetch(REGISTER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      console.log("[AUTH] Status de respuesta:", response.status);
      const result = await response.json();
      console.log("[AUTH] Respuesta del registro:", result);
      
      if (!response.ok) {
        console.error("[AUTH] Registro fallido:", result);
        throw new Error(result.error || result.message || "Error al registrar usuario");
      }
      
      console.log("[AUTH] ¡Registro exitoso!");
      // No auto-login después del registro, solo mostrar mensaje de éxito
      
    } catch (err: any) {
      console.error("[AUTH] Error en registro:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setUser(null);
  };

  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch {
        logout();
      }
    }
    setIsAuthLoading(false);
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const mapRole = (roleValue: number): User["role"] => {
    switch (roleValue) {
      case 10:
        return "normal";
      case 20:
        return "institution";
      case 30:
        return "tester";
      default:
        return "normal";
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthLoading }}
    >
      {!isAuthLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  return context;
};
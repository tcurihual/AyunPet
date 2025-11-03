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
  
  const API_URL = "http://ayunpet-api.eastus2.cloudapp.azure.com/v1/auth/login";
  const REGISTER_API_URL = "http://ayunpet-api.eastus2.cloudapp.azure.com/v1/auth/register/user";

  const login = async (data: LoginData) => {
    setLoading(true);
    try {
      console.log("[AUTH] Intentando login con:", { email: data.email });
      console.log("[AUTH] URL de login:", API_URL);
      
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await response.json().catch(() => ({}));
      console.log("[AUTH] Status login:", response.status);
      console.log("[AUTH] Respuesta login:", result);
      
      if (!response.ok) {
        const msg = result?.message || result?.error || `Error ${response.status}`;
        throw new Error(msg);
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
      console.log("🚀 [AUTH] Iniciando registro...");
      console.log("🚀 [AUTH] URL de registro:", REGISTER_API_URL);
      
      const payload = {
        name: data.fullName,
        email: data.email,
        password: data.password,
        rut: data.rut,
        address: data.address,
        description: data.description,
      };
      
      console.log("🚀 [AUTH] Payload de registro:", payload);
      
      const response = await fetch(REGISTER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      console.log("🚀 [AUTH] Status de respuesta:", response.status);
      console.log("🚀 [AUTH] Headers de respuesta:", Object.fromEntries(response.headers.entries()));
      
      const result = await response.json().catch((e) => {
        console.error("🚀 [AUTH] Error parseando JSON:", e);
        return {};
      });
      
      console.log("🚀 [AUTH] Respuesta del registro:", result);
      
      if (!response.ok) {
        const msg = result?.message || result?.error || `Error ${response.status}`;
        console.error("🚀 [AUTH] Registro fallido:", msg);
        throw new Error(msg);
      }
      
      console.log("✅ [AUTH] ¡Registro exitoso!");
      // No auto-login después del registro
      return;
    } catch (err: any) {
      console.error("❌ [AUTH] Error global en registro:", err);
      console.error("❌ [AUTH] Error stack:", err.stack);
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
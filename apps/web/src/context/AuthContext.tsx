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
import { supabase } from '../lib/supabaseClient';

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

  const login = async (data: LoginData) => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("🟢 Respuesta del servidor:", result);

      if (!response.ok) {
        // Si la API devuelve error 401 o 404, mostramos el mensaje
        throw new Error(result.message || "Error al iniciar sesión");
      }

      if (!result.data || !result.data.token || !result.data.user) {
        throw new Error("Formato inesperado de respuesta del servidor.");
      }

      const { token, user } = result.data;

      // Traducimos el rol numérico del backend a texto local
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

      // Guardamos token y usuario en localStorage
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
    const role = data.userType;
    const { data: newUser, error } = await supabase.from('users').insert([
      {
        name: data.fullName,
        email: data.email,
        password: data.password,
        rut: data.rut,
        address: data.address,
        description: data.description,
        role
      }
    ]).select().single();

    if (error) {
      alert("Error al registrar: " + error.message);
      console.error("Error creando usuario:", error.message);
      return;
    }
    alert("Registro exitoso. Ahora puedes iniciar sesión.");
    setUser(newUser);
    localStorage.setItem("userData", JSON.stringify(newUser));
  } catch (err) {
    alert("Error inesperado en el registro.");
    console.error("Error global en registro:", err);
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

  // Traduce roles numéricos de la API al formato string local
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

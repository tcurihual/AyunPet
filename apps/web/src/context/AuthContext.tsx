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
  id: string | number;
  name: string;
  email: string;
  role: number; // 🔥 CAMBIO: Ahora es number, no string
  rut?: string;
  address?: string;
  description?: string;
  validated?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUserVerification: (verified: boolean) => void;
  isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { setLoading } = useLoading();
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const API_URL = "http://ayunpet-api.eastus2.cloudapp.azure.com/v1/auth/login";
  const REGISTER_API_URL = "http://ayunpet-api.eastus2.cloudapp.azure.com/v1/auth/register/user";

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
        throw new Error(result.message || "Error al iniciar sesión");
      }

      if (!result.data || !result.data.token || !result.data.user) {
        throw new Error("Formato inesperado de respuesta del servidor.");
      }

      const { token, user: apiUser } = result.data;

      // 🔥 CAMBIO: Guardamos el user EXACTAMENTE como viene de la API
      const mappedUser: User = {
        id: apiUser.id,
        name: apiUser.name,
        email: apiUser.email,
        rut: apiUser.rut,
        role: apiUser.role, // 🔥 GUARDAMOS EL NÚMERO REAL: 20, 21, 22
        address: apiUser.address,
        description: apiUser.description,
        validated: apiUser.validated,
        created_at: apiUser.created_at,
        updated_at: apiUser.updated_at,
      };

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(mappedUser)); // 🔥 CAMBIO: key es "user", no "userData"

      setUser(mappedUser);
      setToken(token);
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
      const payload: {
        name: string;
        email: string;
        password: string;
        rut: string;
        description?: string;
        address?: string;
      } = {
        name: data.fullName,
        email: data.email,
        password: data.password,
        rut: data.rut,
      };

      if (data.description && data.description.trim() !== "") {
        payload.description = data.description;
      }
      if (data.address && data.address.trim() !== "") {
        payload.address = data.address;
      }

      const response = await fetch(REGISTER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.status === 201 && result.type === "success") {
        alert(result.message || "Usuario registrado exitosamente");
      } else {
        const errorMessage =
          result.message || result.error || "Error al registrar usuario";
        alert(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error("❌ Error en registro:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole"); // Por si queda guardado
    localStorage.removeItem("userData"); // Por si queda guardado
    setUser(null);
    setToken(null);
  };

  const updateUserVerification = useCallback((verified: boolean) => {
    if (user) {
      const updatedUser = { ...user, validated: verified };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      console.log(`Usuario ${user.email} - validated actualizado a: ${verified}`);
    }
  }, [user]);

  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setToken(token);
      try {
        const userData: User = JSON.parse(storedUser);
        console.log("✅ Usuario recuperado de localStorage:", userData);
        setUser(userData);
      } catch (error) {
        console.error("Error al parsear usuario guardado:", error);
        logout();
      }
    }
    setIsAuthLoading(false);
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        updateUserVerification,
        isAuthLoading,
      }}
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

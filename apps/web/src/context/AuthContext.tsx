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
  role: number;
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

  const API_BASE_URL = "http://ayunpet-api.eastus2.cloudapp.azure.com/v1/auth";

  const login = async (data: LoginData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
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

      const mappedUser: User = {
        id: apiUser.id,
        name: apiUser.name,
        email: apiUser.email,
        rut: apiUser.rut,
        role: apiUser.role,
        address: apiUser.address,
        description: apiUser.description,
        validated: apiUser.validated,
        created_at: apiUser.created_at,
        updated_at: apiUser.updated_at,
      };

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(mappedUser));

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
      // ✅ Determinar el endpoint según el tipo de usuario
      let endpoint = '';
      
      if (data.userType === 'usuario') {
        endpoint = `${API_BASE_URL}/register/user`;
      } else if (data.userType === 'empresa') {
        // Para empresas/instituciones usamos "shelter"
        endpoint = `${API_BASE_URL}/register/shelter`;
      } else if (data.userType === 'dador') {
        endpoint = `${API_BASE_URL}/register/giver`;
      } else {
        throw new Error('Tipo de usuario no válido');
      }

      console.log('📤 Registrando en:', endpoint);

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

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('✅ Respuesta de registro:', result);

      if (response.status === 201 && result.type === "success") {
        const message = data.userType === 'usuario' 
          ? "Usuario registrado exitosamente. Por favor, verifica tu correo electrónico."
          : "Solicitud de registro enviada. Un administrador revisará tu solicitud.";
        
        alert(result.message || message);
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
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
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

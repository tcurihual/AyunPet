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
  role: 'normal' | 'institution' | 'tester';
  emailVerified: boolean;
  rut?: string;
  address?: string;
  description?: string;
}

interface AuthContextType {
  user: User | null;
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

  // 🧩 Registro simulado (puedes reemplazarlo con la API real)
  const register = async (data: RegisterData) => {
    console.warn("⚠️ Función register aún no conectada a API real");
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const role = data.userType === "empresa" ? "institution" : "normal";
      const newUser: User = {
        id: String(Math.floor(Math.random() * 10000)),
        name: data.fullName,
        email: data.email,
        role,
      };
      localStorage.setItem("authToken", "fake_token_" + Date.now());
      localStorage.setItem("userData", JSON.stringify(newUser));
      setUser(newUser);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user'); // ← Limpiar usuario guardado
    setUser(null);
  };

  // Nueva función para actualizar el estado de verificación
  const updateUserVerification = useCallback((verified: boolean) => {
    if (user) {
      const updatedUser = { ...user, emailVerified: verified };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log(`Usuario ${user.email} - emailVerified actualizado a: ${verified}`);
    }
  }, [user]);

  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole') as User['role'] | null;
    const storedUser = localStorage.getItem('user');

    if (token && userData) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        let userData: User | null = null;

        // Si hay usuario guardado en localStorage, usarlo
        if (storedUser) {
          try {
            userData = JSON.parse(storedUser);
            console.log('Usuario recuperado de localStorage:', userData);
          } catch (error) {
            console.error('Error al parsear usuario guardado:', error);
          }
        }

        // Fallback: crear usuario basado en role (para compatibilidad con versiones antiguas)
        if (!userData) {
          if (role === 'institution') {
            userData = { 
              id: '456', 
              name: 'Fundación Sigma', 
              email: 'institucion@test.com', 
              role: 'institution',
              emailVerified: true
            };
          } else if (role === 'tester') {
            userData = { 
              id: '789', 
              name: 'Usuario Tester', 
              email: 'tester@test.com', 
              role: 'tester',
              emailVerified: true
            };
          } else { 
            userData = { 
              id: '123', 
              name: 'Usuario de Prueba', 
              email: 'normal@test.com', 
              role: 'normal',
              emailVerified: false
            };
          }
          // Guardar el usuario creado
          localStorage.setItem('user', JSON.stringify(userData));
        }
        
        setUser(userData);
      } catch (error) {
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

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
  emailVerified?: boolean;
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
        emailVerified: user.emailVerified || false,
      };

      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(mappedUser));
      localStorage.setItem("userRole", mappedRole);

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
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    setUser(null);
    setToken(null);
  };

  const updateUserVerification = useCallback((verified: boolean) => {
    if (user) {
      const updatedUser = { ...user, emailVerified: verified };
      setUser(updatedUser);
      localStorage.setItem("userData", JSON.stringify(updatedUser));
      console.log(`Usuario ${user.email} - emailVerified actualizado a: ${verified}`);
    }
  }, [user]);

  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole") as User["role"] | null;
    const storedUser = localStorage.getItem("userData");

    if (token && storedUser) {
      setToken(token);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        let userData: User | null = null;

        if (storedUser) {
          try {
            userData = JSON.parse(storedUser);
            console.log("Usuario recuperado de localStorage:", userData);
          } catch (error) {
            console.error("Error al parsear usuario guardado:", error);
          }
        }

        if (!userData) {
          if (role === "institution") {
            userData = {
              id: "456",
              name: "Fundación Sigma",
              email: "institucion@test.com",
              role: "institution",
              emailVerified: true,
            };
          } else if (role === "tester") {
            userData = {
              id: "789",
              name: "Usuario Tester",
              email: "tester@test.com",
              role: "tester",
              emailVerified: true,
            };
          } else {
            userData = {
              id: "123",
              name: "Usuario de Prueba",
              email: "normal@test.com",
              role: "normal",
              emailVerified: false,
            };
          }
          localStorage.setItem("userData", JSON.stringify(userData));
        }

        setUser(userData);
      } catch (error) {
        console.error("Error en checkAuthStatus:", error);
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

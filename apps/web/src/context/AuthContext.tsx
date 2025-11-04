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

      if (!response.ok) {
        throw new Error(result.error || "Error al iniciar sesión");
      }

      const userData: User = {
        id: result.data.id,
        name: result.data.name,
        email: result.data.email,
        role: mapRole(result.data.role),
        emailVerified: result.data.emailVerified,
        rut: result.data.rut,
        address: result.data.address,
        description: result.data.description,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      throw error;
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
      if (data.description && data.description.trim() !== '') {
        payload.description = data.description;
      }
      if (data.address && data.address.trim() !== '') {
        payload.address = data.address;
      }

      const response = await fetch(REGISTER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.status === 201 && result.type === 'success') {
        alert(result.message || 'Usuario registrado exitosamente');
        const userData: User = {
          id: result.data.id,
          name: result.data.name,
          email: result.data.email,
          role: mapRole(result.data.role),
          emailVerified: result.data.emailVerified || false,
          rut: result.data.rut,
          address: result.data.address,
          description: result.data.description,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else if (response.status === 409 || response.status === 500) {
        const errorMessage = result.message || result.error || "Error al registrar usuario";
        alert(errorMessage);
        throw new Error(errorMessage);
      } else {
        const errorMessage = result.message || result.error || "Error al registrar usuario";
        alert(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateUserVerification = (verified: boolean) => {
    if (user) {
      const updatedUser = { ...user, emailVerified: verified };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const checkAuthStatus = useCallback(async () => {
    setIsAuthLoading(true);
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      }
    } catch (error) {
      logout();
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
      value={{ user, login, register, logout, updateUserVerification, isAuthLoading }}
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

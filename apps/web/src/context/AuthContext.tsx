import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useLoading } from './LoadingContext';
import { type LoginData } from '../lib/schemas';

interface User {
  id: string;
  fullName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (data: LoginData) => Promise<void>; 
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { setLoading } = useLoading();

  const login = async (data: LoginData) => {
    setLoading(true);
    try {
      console.log("Intentando iniciar sesión con:", data);
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (data.email === "test@test.com" && data.password === "password123") {
        const fakeUserData: User = {
          id: '123',
          fullName: 'Usuario de Prueba',
          email: data.email,
        };
        setUser(fakeUserData);
        console.log("Login exitoso");
      } else {
        throw new Error("Credenciales inválidas");
      }

    } catch (error) {
      console.error("Error en el login:", error);
      throw error; 
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
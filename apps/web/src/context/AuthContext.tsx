import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import { useLoading } from './LoadingContext';
import { type LoginData } from '../lib/schemas';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'normal' | 'institution';
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let fakeUserData: User | null = null;

      if (data.email === "test@test.com" && data.password === "password123") {
        fakeUserData = { id: '123', fullName: 'Usuario de Prueba', email: data.email, role: 'normal' };
      } 
      else if (data.email === "institucion@test.com" && data.password === "password123") {
        fakeUserData = { id: '456', fullName: 'Fundación Huellitas', email: data.email, role: 'institution' };
      }

      if (fakeUserData) {
        setUser(fakeUserData);
        console.log(`Login exitoso como ${fakeUserData.role}`);
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
    console.log("Sesión cerrada.");
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
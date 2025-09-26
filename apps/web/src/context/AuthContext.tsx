import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useLoading } from './LoadingContext';
import { type LoginData } from '../lib/schemas';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'normal' | 'institution' | 'tester';
  rut?: string;
  address?: string;
  description?: string;
}

interface AuthContextType {
  user: User | null;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { setLoading } = useLoading();
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const login = async (data: LoginData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let fakeUserData: User | null = null;
      let fakeToken = "";
      if (data.email === "normal@test.com" && data.password === "password123") {
        fakeUserData = { id: '123', name: 'Usuario de Prueba', email: data.email, role: 'normal' };
        fakeToken = "token_para_usuario_normal_123";
      } 
      else if (data.email === "institucion@test.com" && data.password === "password123") {
        fakeUserData = { id: '456', name: 'Fundación Sigma', email: data.email, role: 'institution' };
        fakeToken = "token_para_institucion_456";
      }
      else if (data.email === "tester@test.com" && data.password === "password123") {
        fakeUserData = { id: '789', name: 'Usuario Tester', email: data.email, role: 'tester' };
        fakeToken = "token_para_usuario_tester_789";
      }

      if (fakeUserData && fakeToken) {
        localStorage.setItem('authToken', fakeToken);
        localStorage.setItem('userRole', fakeUserData.role); 
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
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole'); 
    setUser(null);
  };

  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole') as User['role'] | null; 

    if (token && role) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const userData: User = role === 'institution' 
          ? { id: '456', name: 'Fundación Sigma', email: 'institucion@test.com', role: 'institution' }
          : { id: '123', name: 'Usuario de Prueba', email: 'test@test.com', role: 'normal' };
          
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
  
  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthLoading }}>
      {!isAuthLoading && children}
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
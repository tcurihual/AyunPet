import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useLoading } from './LoadingContext';
import { type LoginData, type RegisterData } from '../lib/schemas';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'normal' | 'institution';
}

interface AuthContextType {
  user: User | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
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

      if (data.email === "test@test.com" && data.password === "password123") {
        fakeUserData = { id: '123', fullName: 'Usuario de Prueba', email: data.email, role: 'normal' };
        fakeToken = "token_para_usuario_normal_123";
      } else if (data.email === "institucion@test.com" && data.password === "password123") {
        fakeUserData = { id: '456', fullName: 'Fundación Huellitas', email: data.email, role: 'institution' };
        fakeToken = "token_para_institucion_456";
      }

      if (fakeUserData && fakeToken) {
        localStorage.setItem('authToken', fakeToken);
        localStorage.setItem('userRole', fakeUserData.role);
        setUser(fakeUserData);
      } else {
        throw new Error("Credenciales inválidas");
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulación de registro exitoso
      const fakeToken = "token_generico_registro_" + Math.floor(Math.random() * 1000);
      const role = data.userType === 'empresa' ? 'institution' : 'normal';
      const newUser: User = {
        id: (Math.floor(Math.random() * 10000)).toString(),
        fullName: data.fullName,
        email: data.email,
        role
      };

      localStorage.setItem('authToken', fakeToken);
      localStorage.setItem('userRole', role);
      setUser(newUser);
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
        await new Promise(resolve => setTimeout(resolve, 500));
        const userData: User = role === 'institution'
          ? { id: '456', fullName: 'Fundación Huellitas', email: 'institucion@test.com', role }
          : { id: '123', fullName: 'Usuario de Prueba', email: 'test@test.com', role };

        setUser(userData);
      } catch {
        logout();
      }
    }
    setIsAuthLoading(false);
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthLoading }}>
      {!isAuthLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  return context;
};

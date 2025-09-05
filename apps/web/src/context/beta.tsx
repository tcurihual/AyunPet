import React, { createContext, useState, ReactNode } from "react";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = (email: string, password: string) => {
    console.log("Login con:", email, password);

    // Aquí quiero que se implemente la requests del backend

    setUser({ id: "1", name: "Demo User", email });
    setToken("fake-token");
  };

  const register = (name: string, email: string, password: string) => {
    console.log("Register con:", name, email, password);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';


interface LoadingContextType {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
}
const LoadingContext = createContext<LoadingContextType | null>(null);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = (loadingState: boolean) => {
    setIsLoading(loadingState);
  };
  
  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading debe ser usado dentro de un LoadingProvider');
  }
  return context;
};
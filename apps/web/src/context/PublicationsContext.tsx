import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useLoading } from './LoadingContext';
import { useAuth } from './AuthContext';

export interface Publication {
  id: string;
  petName: string;
  petImage: string;
  description: string;
  submitterName: string;
  date: string;
}

interface PublicationsContextType {
  publications: Publication[];
  fetchPublications: () => Promise<void>;
}

const PublicationsContext = createContext<PublicationsContextType | undefined>(undefined);

export const PublicationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const { setLoading } = useLoading();
  const { user } = useAuth();

  const fetchPublications = useCallback(async () => {
    if (!user) {
      setPublications([]); 
      return;
    }
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      const mockPublications: Publication[] = [
        { id: '1', petName: 'Luna', petImage: '/images/pets/firulais.jpg', description: 'Una perrita muy juguetona y leal.', submitterName: 'Fundación Huellitas', date: '05-09-2025' },
        { id: '2', petName: 'Rocky', petImage: '/images/pets/simba.jpg', description: 'Leal y cariñoso, ideal para familias.', submitterName: 'Rescate Animal Temuco', date: '01-09-2025' },
        { id: '3', petName: 'Pana Miguel', petImage: '/images/pets/Miguel.webp', description: 'Curioso y muy sociable, busca compañía.', submitterName: 'Fundación Sigma', date: '10-09-2025' },
      ];
      setPublications(mockPublications);
    } catch (error) {
      console.error("Error al cargar las publicaciones:", error);
    } finally {
      setLoading(false); 
    }
  }, [user?.id, setLoading]); 

  const value = {
    publications,
    fetchPublications,
  };

  return (
    <PublicationsContext.Provider value={value}>
      {children}
    </PublicationsContext.Provider>
  );
};

export const usePublications = () => {
  const context = useContext(PublicationsContext);
  if (context === undefined) {
    throw new Error('usePublications debe ser usado dentro de un PublicationsProvider');
  }
  return context;
};
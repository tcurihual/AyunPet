import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useLoading } from './LoadingContext';
import { useAuth } from './AuthContext';

export interface Publication {
  id: string;
  title: string;
  description: string;
  createdAt: string; 
  status: 'active' | 'closed';
  
  creator: {
    id: string;
    name: string;
  };
  
  pet: {
    id: string;
    name: string;
    image: string;
    species: string;
    age: number; 
    size: 'Pequeño' | 'Mediano' | 'Grande';
    gender: 'Macho' | 'Hembra';
    sterilized: boolean;
  };
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
        { 
          id: '1', title: 'Luna busca un hogar', description: 'Una perrita muy juguetona y leal.', createdAt: '05-09-2025', status: 'active',
          creator: { id: '456', name: 'Fundación Sigma' },
          pet: { 
            id: 'p1', name: 'Luna', image: '/images/pets/firulais.jpg',
            species: 'Perro', age: 7, size: 'Mediano', gender: 'Hembra', sterilized: true 
          }
        },
        { 
          id: '2', title: 'Adopta a Rocky', description: 'Leal y cariñoso, ideal para familias.', createdAt: '01-09-2025', status: 'active',
          creator: { id: '789', name: 'Rescate Animal Temuco' },
          pet: { 
            id: 'p2', name: 'Rocky', image: '/images/pets/simba.jpg',
            species: 'Gato', age: 24, size: 'Mediano', gender: 'Macho', sterilized: false 
          }
        },
        { 
          id: '3', title: 'Pana Miguel necesita cariño', description: 'Curioso y muy sociable, busca compañía.', createdAt: '10-09-2025', status: 'active',
          creator: { id: '456', name: 'Fundación Sigma' },
          pet: { 
            id: 'p3', name: 'Pana Miguel', image: '/images/pets/Miguel.webp',
            species: 'Gato', age: 10, size: 'Pequeño', gender: 'Macho', sterilized: true 
          }
        },
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
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';


// (debe coincidir con la estructura de datos del backend)
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
  loading: boolean;
  // aqui pueden ir funciones a futuro, ejemplo:
  // addPublication: (publication: Publication) => void;
}


const PublicationsContext = createContext<PublicationsContextType | undefined>(undefined);

export const PublicationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ejemplo API
  React.useEffect(() => {
    setTimeout(() => {
      const mockPublications: Publication[] = [
        { id: '1', petName: 'Luna', petImage: '/images/pets/luna.jpg', description: 'Una perrita muy juguetona.', submitterName: 'Fundación Huellitas', date: '05-09-2025' },
        { id: '2', petName: 'Rocky', petImage: '/images/pets/rocky.jpg', description: 'Leal y cariñoso, ideal para familias.', submitterName: 'Rescate Animal Temuco', date: '01-09-2025' },
      ];
      setPublications(mockPublications);
      setLoading(false);
    }, 1500); 
  }, []);

  const value = {
    publications,
    loading,
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
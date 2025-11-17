import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useLoading } from './LoadingContext';
import { useAuth } from './AuthContext';

// Estructura de la API adaptada a la interfaz de la aplicación
export interface Publication {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  status: 'active' | 'closed';
  creator: {
    id: string;
    name: string;
    image?: string;
  };
  pet: {
    id: string;
    name: string;
    images: string[]; 
    species: string;
    age: number;
    size: 'Pequeño' | 'Mediano' | 'Grande';
    gender: 'Macho' | 'Hembra';
    sterilized: boolean;
    breed: string;
    healthStatus: string;
    tags: string[];
  };
  post: { 
    images: string[];
  };
}


interface PublicationsContextType {
  publications: Publication[];
  fetchPublications: () => Promise<void>;
}

const PublicationsContext = createContext<PublicationsContextType | undefined>(undefined);

// Función para transformar los datos de la API a la estructura de la aplicación
const transformApiDataToPublication = (item: any): Publication => {
  const petAgeInMonths = (item.pet.age_years || 0) * 12 + (item.pet.age_months || 0);

  const gender = item.pet.gender.toLowerCase() === 'male' ? 'Macho' : 'Hembra';
  const species = item.pet.species.toLowerCase() === 'dog' ? 'Perro' : 'Gato';
  const size = item.pet.size.toLowerCase() === 'small' ? 'Pequeño' : 
                item.pet.size.toLowerCase() === 'medium' ? 'Mediano' : 'Grande';

  return {
    id: String(item.post.id),
    title: item.post.title,
    description: item.post.description,
    createdAt: new Date(item.post.created_at).toLocaleDateString(),
    status: item.post.status === 'active' ? 'active' : 'closed',
    creator: {
      id: String(item.creator.id),
      name: item.creator.name,
      image: item.creator.profilePhoto,
    },
    pet: {
      id: String(item.pet.id),
      name: item.pet.name,
      images: item.pet.images || [], 
      species: species,
      age: petAgeInMonths,
      size: size,
      gender: gender,
      sterilized: item.pet.sterilized,
      breed: 'No especificada',
      healthStatus: 'Sano',
      tags: [],
    },
    post: {
      images: item.post.images || [],
    },
  };
};



export const PublicationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const { setLoading } = useLoading();
  const { user, token } = useAuth();

  const fetchPublications = useCallback(async () => {
    if (!user || !token) {
      setPublications([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://ayunpet-api.eastus2.cloudapp.azure.com/v1/adoptions/publications?page=1&pageSize=20&status=active', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.type === 'success' && Array.isArray(data.data.items)) {
        const transformedPublications = data.data.items.map(transformApiDataToPublication);
        setPublications(transformedPublications);
      } else {
        console.error("La respuesta de la API no tiene el formato esperado:", data);
        setPublications([]);
      }

    } catch (error) {
      console.error("Error al cargar las publicaciones:", error);
      setPublications([]); // Limpiar en caso de error para no mostrar datos antiguos
    } finally {
      setLoading(false);
    }
  }, [user, token, setLoading]);

  const value = { publications, fetchPublications };

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

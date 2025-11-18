import React, { useEffect, useState, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext'; // Importar useAuth
import { usePublications } from '../context/PublicationsContext';
import PetAdoptionCard from '../components/PetAdoptionCard';
import PetFilters, { FilterState } from '../components/PetFilters';

const initialFilterState: FilterState = {
  species: 'todos',
  gender: { macho: false, hembra: false },
  age: { cachorro: false, joven: false, adulto: false, senior: false },
  size: { pequeno: false, mediano: false, grande: false },
  health: { sano: false, desparasitado: false, esterilizado: false, conChip: false },
};

const AdoptionPage: React.FC = () => {
  const { publications, fetchPublications } = usePublications();
  const { token, isAuthLoading } = useAuth(); // Obtener el token y el estado de carga
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Si la autenticación ha terminado y hay un token, buscar publicaciones
    if (!isAuthLoading && token) {
      fetchPublications();
    }
    // Se ejecuta cuando cambia el estado de carga de la autenticación o el token
  }, [isAuthLoading, token, fetchPublications]);

  const filteredPublications = useMemo(() => {
    return publications.filter(pub => {
      const pet = pub.pet;
      const lowerSearchTerm = searchTerm.toLowerCase();

      // Filtrado por término de búsqueda
      if (
        lowerSearchTerm &&
        !pet.name.toLowerCase().includes(lowerSearchTerm) &&
        !pub.creator.name.toLowerCase().includes(lowerSearchTerm)
      ) {
        return false;
      }

      // Filtrado por especie
      if (filters.species !== 'todos' && pet.species !== filters.species) {
        return false;
      }

      // Filtrado por género
      const activeGenderFilters = Object.entries(filters.gender)
        .filter(([, value]) => value)
        .map(([key]) => key);

      if (activeGenderFilters.length > 0 && !activeGenderFilters.includes(pet.gender.toLowerCase())) {
        return false;
      }

      // Filtrado por tamaño
      const activeSizeFilters = Object.entries(filters.size)
        .filter(([, value]) => value)
        .map(([key]) => key);

      if (activeSizeFilters.length > 0 && !activeSizeFilters.includes(pet.size.toLowerCase())) {
        return false;
      }

      // Filtrado por edad
      const petAgeInYears = pet.age / 12;
      const activeAgeFilters = Object.entries(filters.age).filter(([, value]) => value);

      if (activeAgeFilters.length > 0) {
        const matchesAge = activeAgeFilters.some(([key]) => {
          if (key === 'cachorro' && petAgeInYears <= 1) return true;
          if (key === 'joven' && petAgeInYears > 1 && petAgeInYears <= 3) return true;
          if (key === 'adulto' && petAgeInYears > 3 && petAgeInYears <= 8) return true;
          if (key === 'senior' && petAgeInYears > 8) return true;
          return false;
        });
        if (!matchesAge) return false;
      }

      // Filtrado por salud
      if (filters.health.esterilizado && !pet.sterilized) {
        return false;
      }

      return true;
    });
  }, [publications, filters, searchTerm]);

  // Mostrar "Cargando..." mientras se verifica la autenticación
  if (isAuthLoading) {
    return (
      <div className="page-container">
        <Header />
        <main className="requests-page-container">
          <h2 className="title-center">Cargando mascotas...</h2>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />
      <main className="adoption-page-container">
        <h1 className="title-center">Mascotas en Adopción</h1>
        
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Buscar por nombre de mascota o fundación..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="adoption-page-layout">
          <div className="filters-column">
            <PetFilters filters={filters} onFilterChange={setFilters} />
          </div>

          <div className="results-column">
            <div className="pets-grid">
              {filteredPublications.length > 0 ? (
                filteredPublications.map(pub => (
                  <PetAdoptionCard key={pub.id} publication={pub} />
                ))
              ) : (
                <div className="full-width-message">
                  <p>
                    No se encontraron mascotas con esos filtros.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdoptionPage;

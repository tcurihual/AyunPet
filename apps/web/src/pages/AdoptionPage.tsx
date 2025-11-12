import React, { useEffect, useState, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPublications().finally(() => {
      setIsInitialLoad(false);
    });
  }, [fetchPublications]);

  const filteredPublications = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    return publications.filter(pub => {
      const pet = pub.pet;

      if (lowerSearchTerm) {
        const petNameMatch = pet.name.toLowerCase().includes(lowerSearchTerm);
        const creatorNameMatch = pub.creator.name.toLowerCase().includes(lowerSearchTerm);
        if (!petNameMatch && !creatorNameMatch) {
          return false;
        }
      }

      const petAgeMatches = (petAgeInMonths: number, ageFilters: FilterState['age']) => {
        if (!ageFilters.cachorro && !ageFilters.joven && !ageFilters.adulto && !ageFilters.senior) return true;
        if (ageFilters.cachorro && petAgeInMonths <= 12) return true;
        if (ageFilters.joven && petAgeInMonths > 12 && petAgeInMonths <= 36) return true;
        if (ageFilters.adulto && petAgeInMonths > 36 && petAgeInMonths <= 96) return true;
        if (ageFilters.senior && petAgeInMonths > 96) return true;
        return false;
      };

      const petMatchesFilter = (petFilters: FilterState['gender'] | FilterState['size'], petValue: string) => {
        const filtersAsArray = Object.entries(petFilters);
        const activeFilters = filtersAsArray.filter(([key, value]) => value);
        if (activeFilters.length === 0) return true;
        return activeFilters.some(([key, value]) => petValue.toLowerCase().startsWith(key));
      };

      if (filters.species !== 'todos' && pet.species !== filters.species) return false;
      if (!petMatchesFilter(filters.gender, pet.gender)) return false;
      if (!petMatchesFilter(filters.size, pet.size)) return false;
      if (!petAgeMatches(pet.age, filters.age)) return false;
      if (filters.health.esterilizado && !pet.sterilized) return false;

      return true; 
    });
  }, [publications, filters, searchTerm]);

  if (isInitialLoad) {
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
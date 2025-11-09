import React from 'react';
import './PetFilters.css';

export interface FilterState {
  species: 'todos' | 'Gato' | 'Perro';
  gender: {
    macho: boolean;
    hembra: boolean;
  };
  age: {
    cachorro: boolean;
    joven: boolean;
    adulto: boolean;
    senior: boolean;
  };
  size: {
    pequeno: boolean;
    mediano: boolean;
    grande: boolean;
  };
  health: {
    sano: boolean;
    desparasitado: boolean;
    esterilizado: boolean;
    conChip: boolean;
  };
}

interface PetFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const PetFilters: React.FC<PetFiltersProps> = ({ filters, onFilterChange }) => {
  
  
  const handleSpeciesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      species: e.target.value as FilterState['species'],
    });
  };

  const handleCheckboxChange = (
    group: 'gender' | 'age' | 'size' | 'health',
    key: string
  ) => {
    onFilterChange({
      ...filters,
      [group]: {
        ...filters[group],
        [key]: !filters[group][key as keyof typeof filters[group]],
      },
    });
  };

  return (
    <aside className="filter-sidebar">
      <h3>Filtrar Búsqueda</h3>

      <div className="filter-group">
        <label className="filter-label">Tipo de animal</label>
        <select value={filters.species} onChange={handleSpeciesChange}>
          <option value="todos">Todos</option>
          <option value="Perro">Perro</option>
          <option value="Gato">Gato</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Género</label>
        <div className="checkbox-option">
          <input
            type="checkbox"
            id="macho"
            checked={filters.gender.macho}
            onChange={() => handleCheckboxChange('gender', 'macho')}
          />
          <label htmlFor="macho">Macho</label>
        </div>
        <div className="checkbox-option">
          <input
            type="checkbox"
            id="hembra"
            checked={filters.gender.hembra}
            onChange={() => handleCheckboxChange('gender', 'hembra')}
          />
          <label htmlFor="hembra">Hembra</label>
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Edad</label>
        <div className="checkbox-option">
          <input type="checkbox" id="cachorro" checked={filters.age.cachorro} onChange={() => handleCheckboxChange('age', 'cachorro')} />
          <label htmlFor="cachorro">Cachorro (0-1 año)</label>
        </div>
        <div className="checkbox-option">
          <input type="checkbox" id="joven" checked={filters.age.joven} onChange={() => handleCheckboxChange('age', 'joven')} />
          <label htmlFor="joven">Joven (1-3 años)</label>
        </div>
        <div className="checkbox-option">
          <input type="checkbox" id="adulto" checked={filters.age.adulto} onChange={() => handleCheckboxChange('age', 'adulto')} />
          <label htmlFor="adulto">Adulto (3-8 años)</label>
        </div>
        <div className="checkbox-option">
          <input type="checkbox" id="senior" checked={filters.age.senior} onChange={() => handleCheckboxChange('age', 'senior')} />
          <label htmlFor="senior">Senior (8 años o más)</label>
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Tamaño</label>
         <div className="checkbox-option">
          <input type="checkbox" id="pequeno" checked={filters.size.pequeno} onChange={() => handleCheckboxChange('size', 'pequeno')} />
          <label htmlFor="pequeno">Pequeño</label>
        </div>
         <div className="checkbox-option">
          <input type="checkbox" id="mediano" checked={filters.size.mediano} onChange={() => handleCheckboxChange('size', 'mediano')} />
          <label htmlFor="mediano">Mediano</label>
        </div>
         <div className="checkbox-option">
          <input type="checkbox" id="grande" checked={filters.size.grande} onChange={() => handleCheckboxChange('size', 'grande')} />
          <label htmlFor="grande">Grande</label>
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Estado de Salud</label>
        <div className="checkbox-option">
          <input type="checkbox" id="sano" checked={filters.health.sano} onChange={() => handleCheckboxChange('health', 'sano')} />
          <label htmlFor="sano">Sano</label>
        </div>
        <div className="checkbox-option">
          <input type="checkbox" id="desparasitado" checked={filters.health.desparasitado} onChange={() => handleCheckboxChange('health', 'desparasitado')} />
          <label htmlFor="desparasitado">Desparasitado</label>
        </div>
        <div className="checkbox-option">
          <input type="checkbox" id="esterilizado" checked={filters.health.esterilizado} onChange={() => handleCheckboxChange('health', 'esterilizado')} />
          <label htmlFor="esterilizado">Esterilizado</label>
        </div>
        <div className="checkbox-option">
          <input type="checkbox" id="conChip" checked={filters.health.conChip} onChange={() => handleCheckboxChange('health', 'conChip')} />
          <label htmlFor="conChip">Con chip</label>
        </div>
      </div>
    </aside>
  );
};

export default PetFilters;
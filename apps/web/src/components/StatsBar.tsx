import React from 'react';

interface StatsBarProps {
  activas: number;
  adoptadas: number;
  exitoPercentage: number;
  tiempoRespuesta: string;
  rating: number;
}

const StatItem: React.FC<{ value: string | number; label: string }> = ({ value, label }) => (
  <div className="stat-item">
    <strong>{value}</strong>
    <span>{label}</span>
  </div>
);

const StatsBar: React.FC<StatsBarProps> = ({ 
  activas = 0,
  adoptadas = 0,
  exitoPercentage = 0,
  tiempoRespuesta = 'N/A',
  rating = 0
}) => {
  return (
    <div className="stats-bar">
      <StatItem value={activas} label="Activas" />
      <StatItem value={adoptadas} label="Adoptadas" />
      <StatItem value={`${exitoPercentage}%`} label="Éxito" />
      <StatItem value={tiempoRespuesta} label="Respuesta" />
      <StatItem value={rating.toFixed(1)} label="Rating" />
      <button className="btn btn-follow">Seguir</button>
    </div>
  );
};

export default StatsBar;

import React from 'react';

const StatItem: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="stat-item">
    <strong>{value}</strong>
    <span>{label}</span>
  </div>
);

const StatsBar: React.FC = () => {
  return (
    <div className="stats-bar">
      <StatItem value="2" label="Activas" />
      <StatItem value="142" label="Adoptadas" />
      <StatItem value="93%" label="Éxito" />
      <StatItem value="~3h" label="Respuesta" />
      <StatItem value="4.8" label="Rating" />
      <button className="btn btn-follow">Seguir</button>
    </div>
  );
};

export default StatsBar;
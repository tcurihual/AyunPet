import React, { useState } from "react";
import VerificacionAdminPage from '../../pages/VerificationAdminPage';
import SearchAccountsPage from '../../pages/search_acounts';
import AdminReportsPage from "../../pages/AdminReportsPage";
import GraficoTorta from '../charts/PieChart';
import GraficoBarras from '../charts/BarChart';
import "./aNav.css"; 

const mascotasData = [
  { name: "Totales", value: 120 },
  { name: "Adoptadas", value: 80 },
];
const barrasMascotasData = [
  { name: "Mascotas", totales: 120, adoptadas: 80 },
];


const Pesta = ["Datos Generales", "Cuentas", "solicitudes de Verificación", "Reportes"]

// Un solo array con los textos
const textos = [
  <div>
    <h2>Mascotas Totales vs Adoptadas</h2>
    <GraficoTorta data={mascotasData} colors={["#1976D2", "#43A047"]} />
    <h2>Comparativa en Barras</h2>
    <GraficoBarras data={barrasMascotasData} barKey="totales" barColor="#1976D2" />
    <GraficoBarras data={barrasMascotasData} barKey="adoptadas" barColor="#43A047" />
  </div>,
  <SearchAccountsPage/>,    //Cuentas
  <VerificacionAdminPage/>, //Verificador
  <AdminReportsPage/>, //Reportes
];

const Dashboard: React.FC = () => {
  const [pesActivo, setpesActivo] = useState(0);

  const siguiente = () => {
    if (pesActivo < Pesta.length - 1) setpesActivo(pesActivo + 1);
  };

  const anterior = () => {
    if (pesActivo > 0) setpesActivo(pesActivo - 1);
  };

  return (
    <div className="dashboard-container">
      {/* NAV de Pesta */}
      <div className="navContainer">
        <button className="flecha" onClick={anterior} disabled={pesActivo === 0}>
          ‹
        </button>

        <div className="Pesta">
          {Pesta.map((pes, index) => (
            <span
              key={index}
              className={index === pesActivo ? "pes activo" : "pes"}
              onClick={() => setpesActivo(index)}
            >
              {pes}
            </span>
          ))}
        </div>

        <button
          className="flecha"
          onClick={siguiente}
          disabled={pesActivo === Pesta.length - 1}
        >
          ›
        </button>
      </div>

      {/* Texto dinámico */}
      <div className="texto-pes">
        <p>{textos[pesActivo]}</p>
      </div>
    </div>
  );
};

export default Dashboard;

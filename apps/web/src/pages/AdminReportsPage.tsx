import React, { useState } from 'react';


interface Report {
  id: number;
  [key: string]: any;
}

const AdminReportsPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string>('usuarios');

  const reports = {
    usuarios: [
      { id: 1, nombre: 'Maximiliano Saez', email: 'elmaxi@gmail.com', denuncias: 3, estado: 'Pendiente' },
      { id: 2, nombre: 'Agustin Vega', email: 'agustinvega@gmail.com', denuncias: 1, estado: 'Revisado' },
      { id: 3, nombre: 'Usuario C', email: 'usuarioc@example.com', denuncias: 5, estado: 'En revisión' },
    ],
    publicaciones: [
      { id: 1, titulo: 'Perrito perdido', autor: 'María García', denuncias: 2, estado: 'Pendiente' },
      { id: 2, titulo: 'Adopción falsa', autor: 'Juan Pérez', denuncias: 4, estado: 'En revisión' },
      { id: 3, titulo: 'Gato rescatado', autor: 'Ana López', denuncias: 1, estado: 'Revisado' },
    ],
  };

  const getStatusClass = (estado: string) => {
    const statusMap: { [key: string]: string } = {
      'Pendiente': 'status-pendiente',
      'Revisado': 'status-revisado',
      'En revisión': 'status-revision',
    };
    return statusMap[estado] || 'status-pendiente';
  };

  const renderTable = (type: string) => {
    const data = reports[type as keyof typeof reports];

    if (!data || data.length === 0) {
      return (
        <div className="admin-empty-state">
          No hay reportes disponibles en esta categoría.
        </div>
      );
    }

    return (
      <table className="admin-reports-table">
        <thead>
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: Report) => (
            <tr key={row.id}>
              {Object.entries(row).map(([key, value], i) => (
                <td key={i}>
                  {key === 'denuncias' ? (
                    <span className="report-denuncias-badge">{value}</span>
                  ) : key === 'estado' ? (
                    <span className={`report-status-badge ${getStatusClass(value as string)}`}>
                      {value}
                    </span>
                  ) : (
                    value
                  )}
                </td>
              ))}
              <td>
                <div className="report-actions">
                  <button className="btn-action-small btn-view">
                    Ver
                  </button>
                  <button className="btn-action-small btn-resolve">
                    Resolver
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="page-container">
    

      <main className="main-content">
        <div className="admin-reports-container">
          <h1 className="admin-reports-title">Panel de Reportes</h1>

          <div className="admin-reports-tabs">
            <button
              onClick={() => setSelectedReport('usuarios')}
              className={`admin-tab-btn ${selectedReport === 'usuarios' ? 'active' : ''}`}
            >
              Reportes de Usuarios
            </button>
            <button
              onClick={() => setSelectedReport('publicaciones')}
              className={`admin-tab-btn ${selectedReport === 'publicaciones' ? 'active' : ''}`}
            >
              Reportes de Publicaciones
            </button>
          </div>

          <div className="admin-reports-table-wrapper">
            {renderTable(selectedReport)}
          </div>
        </div>
      </main>

     
    </div>
  );
};

export default AdminReportsPage;
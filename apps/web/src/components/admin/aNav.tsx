import React, { useState } from 'react';

const Dashboard: React.FC = () => {
  const [info, setInfo] = useState<string>('Usuarios');

  return (
    <div className="aPubs" style={{ textAlign: 'center' }}>
      

      <div style={{ marginTop: '10px' }}>
        <button onClick={() => setInfo('Cuentas Admin')}>Ventas</button>
        <button onClick={() => setInfo('Datos Generales')}>Datos Generales</button>
        <button onClick={() => setInfo('Verificaciones')}>solicitudes</button>
        <button onClick={() => setInfo('Reportes')}>Reportes</button>
      </div>
      <div className="pub">
        <p>{info}</p>
      </div>
    </div>
  );
};

export default Dashboard;
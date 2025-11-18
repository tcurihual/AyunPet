import React from 'react';
import APets from './admin/aPets';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
       <tr>
     <th> <div className="dash1"></div>
      <h1>Herramientas</h1>
      
      <ul>
          <li> <a href="#1">Datos Generales</a> </li>
          <li> <a href="#2">Publicaiones</a> </li>
          <li> <a href="#3">Reportes</a> </li>
          <li> <a href="#4">Usuarios</a> </li>
          <li> <a href="#5">Mascotas</a> </li>
          <li> <a href="#6">Adopciones</a> </li>
          <li> <a href="#7">Miscaleano</a> </li>
      </ul>
    </th>
    <tr>
          <APets />
      
    </tr>
    </tr>
    </div>
  );
};

export default Dashboard;
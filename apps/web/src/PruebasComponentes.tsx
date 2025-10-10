import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import GraficoTorta from './components/charts/PieChart';
import GraficoBarras from './components/charts/BarChart';

const datosAdopciones = [
  { name: 'Mascotas Adoptadas', value: 45 },
  { name: 'Mascotas Disponibles', value: 105 },
];
const datosPorEspecie = [
  { name: 'Perros', value: 80 },
  { name: 'Gatos', value: 70 },
  { name: 'Otro', value:60}
];
const datosMensuales = [
  { name: 'Enero', adopciones: 3 },
  { name: 'Febrero', adopciones: 5 },
  { name: 'Marzo', adopciones: 6 },
  { name: 'Abril', adopciones: 4 },
  { name: 'Mayo', adopciones: 8 },
  { name: 'Junio', adopciones: 4 },
  { name: 'Julio', adopciones: 7 },
  { name: 'Agosto', adopciones: 12 },
  { name: 'Septiembre', adopciones: 9 },
  { name: 'Octubre', adopciones: 10 },
  { name: 'Noviembre', adopciones: 6 },
  { name: 'Diciembre', adopciones: 11 },
];
const datosSinOrdenar = [
  { name: '10/01/2023', adopciones: 3 },
  { name: '22/02/2024', adopciones: 5 },
  { name: '15/03/2025', adopciones: 6 },
  { name: '07/04/2023', adopciones: 4 },
  { name: '30/05/2025', adopciones: 8 },
  { name: '12/06/2024', adopciones: 4 },
  { name: '25/07/2023', adopciones: 7 },
  { name: '18/08/2025', adopciones: 12 },
  { name: '03/09/2024', adopciones: 9 },
  { name: '27/10/2025', adopciones: 10 },
  { name: '14/11/2023', adopciones: 6 },
  { name: '31/12/2024', adopciones: 11 },
  { name: '05/01/2024', adopciones: 2 },
  { name: '19/02/2025', adopciones: 9 },
  { name: '08/03/2023', adopciones: 5 },
  { name: '21/04/2024', adopciones: 7 },
  { name: '02/05/2023', adopciones: 3 },
  { name: '17/06/2025', adopciones: 11 },
  { name: '29/07/2024', adopciones: 6 },
  { name: '11/08/2023', adopciones: 10 },
  { name: '06/09/2025', adopciones: 13 },
  { name: '20/10/2023', adopciones: 4 },
  { name: '09/11/2025', adopciones: 8 },
  { name: '24/12/2023', adopciones: 7 },
  { name: '13/01/2025', adopciones: 5 },
  { name: '28/02/2023', adopciones: 6 },
  { name: '04/03/2024', adopciones: 7 },
  { name: '26/04/2025', adopciones: 9 },
  { name: '15/05/2024', adopciones: 12 },
  { name: '07/06/2023', adopciones: 3 },
  { name: '22/07/2025', adopciones: 14 },
  { name: '30/08/2024', adopciones: 9 },
  { name: '16/09/2023', adopciones: 5 },
  { name: '08/10/2024', adopciones: 11 },
  { name: '19/11/2024', adopciones: 7 },
  { name: '28/12/2025', adopciones: 15 },
];


// coso para ordenar fechas
const parsearFecha = (fechaStr: string): Date => {
  const [dia, mes, anio] = fechaStr.split('/').map(Number);
  return new Date(anio, mes - 1, dia);
};

const datosOrdenados = datosSinOrdenar.sort((a, b) => {
  const fechaA = parsearFecha(a.name);
  const fechaB = parsearFecha(b.name);
  return fechaA.getTime() - fechaB.getTime();
});

const datosParaGrafico = datosOrdenados.map(dato => {
  const fecha = parsearFecha(dato.name);
  const nombreFormateado = fecha.toLocaleString('es-CL', { day: '2-digit', month: 'short', year: '2-digit' });
  
  return {
    ...dato,
    name: nombreFormateado.charAt(0).toUpperCase() + nombreFormateado.slice(1),
  };
});
// fin coso


const coloresEspecie = ['#c16c6cff', '#67c8b5ff', '#7e7dcbff'];

const Pruebas: React.FC = () => {
  return (
    <div className="page-container">
      <Header />
      <main className="main-content" style={{ display: 'block', padding: '40px' }}>
        <h1 className="title-center">Página de Pruebas</h1>
        <p style={{ textAlign: 'center', marginBottom: '40px' }}>
          Aquí podemos probar componentes nuevos, como el gráfico de Recharts.
        </p>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
          <h3 style={{ textAlign: 'center' }}>Estado Actual de Adopciones</h3>
          <GraficoTorta data={datosAdopciones} />
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px' }}>
          <h3 style={{ textAlign: 'center' }}>Distribución por Especie</h3>
          <GraficoTorta data={datosPorEspecie} colors={coloresEspecie} />
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px', marginTop: '20px' }}>
          <h3 style={{ textAlign: 'center' }}>Adopciones por Mes</h3>
          <GraficoBarras data={datosMensuales} barKey="adopciones" barColor="#8884d8" />
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px' }}>
          <h3 style={{ textAlign: 'center' }}>Adopciones a Través del Tiempo</h3>
          <GraficoBarras data={datosParaGrafico} barKey="adopciones" barColor="#82ca9d" />

        </div>

      </main>
      <Footer />
    </div>
  );
};

export default Pruebas;
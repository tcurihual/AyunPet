import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';  

interface BarChartData {
  name: string; 
  [key: string]: any; 
}

interface GraficoBarrasProps {
  data: BarChartData[];
  barKey: string;
  barColor: string; 
}

const GraficoBarras: React.FC<GraficoBarrasProps> = ({ data, barKey, barColor }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" /> 
        <XAxis dataKey="name" /> 
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={barKey} fill={barColor} name={barKey.charAt(0).toUpperCase() + barKey.slice(1)} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default GraficoBarras;
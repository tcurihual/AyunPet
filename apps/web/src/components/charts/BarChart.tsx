import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const getCSSVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name);

interface BarChartData {
  name: string;
  [key: string]: any;
}
interface GraficoBarrasProps {
  data: BarChartData[];
  barKeys: string[];
  barColors: string[];
}

const GraficoBarras: React.FC<GraficoBarrasProps> = ({ data, barKeys, barColors }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} margin={{ top: 8, right: 40, left: 40, bottom: 10 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis allowDecimals={false} />
      <Tooltip
        contentStyle={{
          background: getCSSVar('--color-bg-content'),
          color: getCSSVar('--color-text-primary'),
          border: "none",
          borderRadius: "10px",
          fontWeight: 500,
          fontSize: "1.08em"
        }}
      />
      <Legend />
      {barKeys.map((key, idx) => (
        <Bar
          key={key}
          dataKey={key}
          fill={barColors[idx % barColors.length]}
          name={key}
          barSize={40}
          radius={[8, 8, 8, 8]}
        />
      ))}
    </BarChart>
  </ResponsiveContainer>
);

export default GraficoBarras;

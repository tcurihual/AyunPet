import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}
interface GraficoTortaProps {
  data: ChartData[];
  colors?: string[];
}
const DEFAULT_COLORS = ['#8884d8', '#82ca9d', '#ffc658'];
const GraficoTorta: React.FC<GraficoTortaProps> = ({ data, colors = DEFAULT_COLORS }) => (
  <ResponsiveContainer width="100%" height={400}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={150}
        fill="#8884d8"
        dataKey="value"
        nameKey="name"
        label={(props) => {
          if (typeof props.percent !== 'number' || typeof props.name !== 'string') return '';
          const percentage = (props.percent * 100).toFixed(0);
          return `${props.name} ${percentage}%`;
        }}
      >
        {data.map((_entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);
export default GraficoTorta;
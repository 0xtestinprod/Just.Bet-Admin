'use client';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const data = [
  { name: 'Jan', value: 2400 },
  { name: 'Feb', value: 1398 },
  { name: 'Mar', value: 9800 },
  { name: 'Apr', value: 3908 },
  { name: 'May', value: 4800 },
  { name: 'Jun', value: 3800 },
  { name: 'Jul', value: 4300 }
];

export function PlayerGrowth() {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip contentStyle={{ backgroundColor: '#08060f' }} />
        <Line
          type='monotone'
          dataKey='value'
          stroke='#adfa1d'
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

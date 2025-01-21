'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  RadialBarChart,
  RadialBar,
  Legend,
  PolarAngleAxis,
  ResponsiveContainer
} from 'recharts';

export default function RewardPercentageStats() {
  // In a real application, you would fetch this data from your API
  const stats = {
    averagePercentage: 15.5,
    minPercentage: 5.0,
    maxPercentage: 25.0,
    medianPercentage: 12.5
  };

  const data = [
    { name: 'Min', value: stats.minPercentage, fill: '#8884d8' },
    { name: 'Median', value: stats.medianPercentage, fill: '#83a6ed' },
    { name: 'Average', value: stats.averagePercentage, fill: '#8dd1e1' },
    { name: 'Max', value: stats.maxPercentage, fill: '#82ca9d' }
  ];

  return (
    <Card className='h-[400px]'>
      <CardHeader>
        <CardTitle>Reward Percentage Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height='100%'>
          <RadialBarChart
            cx='50%'
            cy='50%'
            innerRadius='10%'
            outerRadius='80%'
            barSize={10}
            data={data}
          >
            <PolarAngleAxis
              type='number'
              domain={[0, 30]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar background dataKey='value' />
            <Legend
              iconSize={10}
              layout='vertical'
              verticalAlign='middle'
              align='right'
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

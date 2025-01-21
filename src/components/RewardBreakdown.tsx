'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function RewardBreakdown() {
  // In a real application, you would fetch this data from your API
  const rewardBreakdown = [
    {
      token: '0x123...',
      tokenAmount: 1000,
      usdValue: 1500.5,
      count: 10,
      percentage: 25.5
    },
    {
      token: '0x456...',
      tokenAmount: 2000,
      usdValue: 3000,
      count: 20,
      percentage: 50
    },
    {
      token: '0x789...',
      tokenAmount: 500,
      usdValue: 750.25,
      count: 5,
      percentage: 24.5
    }
  ];

  return (
    <Card className='h-[400px]'>
      <CardHeader>
        <CardTitle>Reward Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={rewardBreakdown}
              cx='50%'
              cy='50%'
              labelLine={false}
              outerRadius={80}
              fill='#8884d8'
              dataKey='usdValue'
            >
              {rewardBreakdown.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  RadialBarChart as RechartsRadialBarChart,
  RadialBar,
  Legend,
  PolarAngleAxis
} from 'recharts';
import { formatPercentage } from 'utils/formatPercentage';

interface RewardPercentageStats {
  averagePercentage: number;
  minPercentage: number;
  maxPercentage: number;
  medianPercentage: number;
}

export default function RewardPercentageStats({
  stats
}: {
  stats: RewardPercentageStats;
}) {
  const COLORS = ['#7C3AED', '#22D3EE', '#F472B6', '#4ADE80'];

  const chartData = [
    { name: 'Min', value: stats.minPercentage, fill: COLORS[0] },
    { name: 'Median', value: stats.medianPercentage, fill: COLORS[1] },
    { name: 'Average', value: stats.averagePercentage, fill: COLORS[2] },
    { name: 'Max', value: stats.maxPercentage, fill: COLORS[3] }
  ];

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='text-center text-2xl font-bold'>
          Reward Percentage Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col items-center'>
        <div className='h-128 w-128'>
          <RechartsRadialBarChart
            width={500}
            height={250}
            innerRadius='30%'
            outerRadius='100%'
            data={chartData}
            startAngle={180}
            endAngle={0}
          >
            <PolarAngleAxis
              type='number'
              domain={[0.9998, 1.0002]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar background dataKey='value' />
            <Legend
              iconSize={15}
              width={160}
              height={180}
              layout='vertical'
              verticalAlign='middle'
              align='left'
            />
          </RechartsRadialBarChart>
        </div>
        <div className='mt-6 grid w-full max-w-md grid-cols-2 gap-4'>
          <StatItem
            label='Average'
            value={stats.averagePercentage}
            color={COLORS[2]}
          />
          <StatItem
            label='Median'
            value={stats.medianPercentage}
            color={COLORS[1]}
          />
          <StatItem label='Min' value={stats.minPercentage} color={COLORS[0]} />
          <StatItem label='Max' value={stats.maxPercentage} color={COLORS[3]} />
        </div>
      </CardContent>
    </Card>
  );
}

function StatItem({
  label,
  value,
  color
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className='flex flex-col items-center rounded-lg bg-muted p-2'>
      <span className='text-sm'>{label}</span>
      <span className='text-lg font-semibold' style={{ color }}>
        {formatPercentage(value)}
      </span>
    </div>
  );
}

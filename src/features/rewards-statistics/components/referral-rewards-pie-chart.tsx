'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { Pie, PieChart, Cell, ResponsiveContainer, Sector } from 'recharts';
import { DollarSign, Users } from 'lucide-react';

interface RewardBreakdownData {
  token: string;
  tokenAmount: number;
  usdValue: number;
  count: number;
  percentage: number;
}

interface TokenMetadata {
  [key: string]: {
    symbol: string;
    color: string;
  };
}

const TOKEN_METADATA: TokenMetadata = {
  '0x0381132632E9E27A8f37F1bc56bd5a62d21a382B': {
    symbol: 'USDT',
    color: 'hsl(var(--chart-1))'
  },
  '0xE60256921AE414D7B35d6e881e47931f45E027cf': {
    symbol: 'USDC',
    color: 'hsl(var(--chart-2))'
  }
};

// Mock data
const MOCK_DATA: RewardBreakdownData[] = [
  {
    token: '0x0381132632E9E27A8f37F1bc56bd5a62d21a382B',
    tokenAmount: 6679.116195791381,
    usdValue: 6679.7841074109565,
    count: 482,
    percentage: 47.577095061842904
  },
  {
    token: '0xE60256921AE414D7B35d6e881e47931f45E027cf',
    tokenAmount: 7360.867822758278,
    usdValue: 7360.131735976002,
    count: 518,
    percentage: 52.42290493815709
  }
];

const ReferralRewardsPieChart: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const data = MOCK_DATA;

  const chartData = data.map((item) => ({
    name: TOKEN_METADATA[item.token]?.symbol || 'Unknown',
    value: item.usdValue,
    percentage: item.percentage,
    color: TOKEN_METADATA[item.token]?.color || 'hsl(var(--chart-5))',
    count: item.count,
    tokenAmount: item.tokenAmount
  }));

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const totalUSDValue = chartData.reduce((sum, item) => sum + item.value, 0);
  const totalCount = chartData.reduce((sum, item) => sum + item.count, 0);

  // Ensure we have a valid configuration object
  const chartConfig = chartData.reduce(
    (config, item) => {
      if (item.name && item.color) {
        config[item.name] = {
          label: item.name,
          color: item.color
        };
      }
      return config;
    },
    {} as Record<string, { label: string; color: string }>
  );

  return (
    <Card className='w-full max-w-4xl'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>
          Reward Distribution
        </CardTitle>
        <CardDescription>
          Breakdown of referral rewards by token type
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <div className='md:col-span-2'>
            <ChartContainer className='h-[300px]' config={chartConfig}>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={chartData}
                    dataKey='value'
                    nameKey='name'
                    cx='50%'
                    cy='50%'
                    innerRadius={60}
                    outerRadius={80}
                    onMouseEnter={onPieEnter}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className='flex flex-col justify-center space-y-4'>
            <div className='rounded-lg bg-secondary p-4'>
              <div className='flex items-center space-x-2'>
                <DollarSign className='text-primary' />
                <span className='text-sm font-medium'>Total USD Value</span>
              </div>
              <p className='text-2xl font-bold'>${totalUSDValue.toFixed(2)}</p>
            </div>
            <div className='rounded-lg bg-secondary p-4'>
              <div className='flex items-center space-x-2'>
                <Users className='text-primary' />
                <span className='text-sm font-medium'>Total Referrals</span>
              </div>
              <p className='text-2xl font-bold'>{totalCount}</p>
            </div>
          </div>
        </div>
        <ChartLegend className='mt-8'>
          <ChartLegendContent />
        </ChartLegend>
      </CardContent>
    </Card>
  );
};

const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value
  } = props;
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor='middle'
        fill={fill}
        className='text-xl font-bold'
      >
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill='none'
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke='none' />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill='currentColor'
        className='text-sm'
      >{`$${value.toFixed(2)}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill='currentColor'
        className='text-sm'
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default ReferralRewardsPieChart;

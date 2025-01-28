'use client';

import type React from 'react';
import { useState, useMemo } from 'react';
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
import type { RewardBreakdown } from '@/models/referral';
import TokenInfoTable from './token-info-table';
import { Token } from '@/models/token';

// Generate a color palette based on the primary color with different saturations and lightness
const generateColorPalette = (numColors: number): string[] => {
  const baseHues = [250, 200, 150, 300, 100]; // Purple-based hues
  const colors: string[] = [];

  for (let i = 0; i < numColors; i++) {
    const hue = baseHues[i % baseHues.length];
    const saturation = 70 + ((i * 5) % 20); // Vary saturation between 70-90
    const lightness = 45 + ((i * 7) % 25); // Vary lightness between 45-70
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  return colors;
};

// Token metadata cache with dynamic color assignment
const tokenMetadataCache = new Map<string, { symbol: string; color: string }>();

const getTokenMetadata = (token: string, index: number, colors: string[]) => {
  if (!tokenMetadataCache.has(token)) {
    // In a real app, you might want to fetch token metadata from a service
    tokenMetadataCache.set(token, {
      symbol: `Token ${index + 1}`, // Fallback symbol
      color: colors[index % colors.length]
    });
  }
  return tokenMetadataCache.get(token)!;
};

const ReferralRewardsPieChart: React.FC<{
  data: RewardBreakdown[];
  totalPendingRewards: number;
  tokens: Token[];
}> = ({ data, totalPendingRewards, tokens }) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>();

  // Generate colors based on number of tokens
  const colors = useMemo(
    () => generateColorPalette(data.length),
    [data.length]
  );
  console.log(tokens, 'tokens');
  // Process chart data with dynamic colors
  const chartData = useMemo(() => {
    return data.map((item, index) => {
      const metadata = getTokenMetadata(item.token, index, colors);
      return {
        name:
          tokens.find((token) => token.address === item.token)?.symbol ||
          item.token,
        value: item.usdValue,
        percentage: item.percentage,
        color: metadata.color,
        count: item.count,
        tokenAmount: item.tokenAmount,
        tokenAddress: item.token // Keep original address for reference
      };
    });
  }, [data, colors, tokens]);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const totalCount = useMemo(
    () => chartData.reduce((sum, item) => sum + item.count, 0),
    [chartData]
  );

  // Generate chart config dynamically
  const chartConfig = useMemo(
    () =>
      chartData.reduce(
        (config, item) => ({
          ...config,
          [item.name]: {
            label: item.name,
            color: item.color,
            tokenAddress: item.tokenAddress // Store address for reference
          }
        }),
        {} as Record<
          string,
          { label: string; color: string; tokenAddress: string }
        >
      ),
    [chartData]
  );

  return (
    <Card className='w-full max-w-4xl'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='text-2xl font-bold'>
              Reward Distribution ({data.length} Tokens)
            </CardTitle>
            <CardDescription>
              Breakdown of referral rewards by token type
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <div className='flex flex-col justify-center space-y-4'>
            <div className='rounded-lg bg-secondary p-4'>
              <div className='flex items-center space-x-2'>
                <DollarSign className='text-primary' />
                <span className='text-sm font-medium'>
                  Total Pending Rewards
                </span>
              </div>
              <p className='text-2xl font-bold'>
                ${totalPendingRewards?.toFixed(2) || 0}
              </p>
            </div>
            <div className='rounded-lg bg-secondary p-4'>
              <div className='flex items-center space-x-2'>
                <Users className='text-primary' />
                <span className='text-sm font-medium'>Total Referrals</span>
              </div>
              <p className='text-2xl font-bold'>{totalCount}</p>
            </div>
          </div>
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
        </div>
        <ChartLegend className='mt-8'>
          <ChartLegendContent />
        </ChartLegend>
        <TokenInfoTable data={chartData} />
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
        dy={-8}
        textAnchor='middle'
        fill={fill}
        className='text-xl font-bold'
      >
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy}
        dy={16}
        textAnchor='middle'
        fill={fill}
        className='text-xs'
      >
        {payload.tokenAddress.slice(0, 6)}...{payload.tokenAddress.slice(-4)}
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

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

export function GameVolumeChart({ data }: { data: any }) {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='game' />
        <YAxis
          tickFormatter={(value: number) => `${(value / 1e9).toFixed(1)}B`}
        />
        <Tooltip
          content={<CustomTooltip />}
          formatter={(value: number) => formatCurrency(value)}
        />
        <Bar dataKey='volume' fill='#8884d8' />
      </BarChart>
    </ResponsiveContainer>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className='rounded-lg bg-white/95 p-2 shadow-lg'>
      <p className='text-sm text-purple-600'>game: {payload[0].payload.game}</p>
      <p className='text-sm text-purple-600'>
        volume: ${payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

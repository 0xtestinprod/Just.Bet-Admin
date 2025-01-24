import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

export function HourlyVolumeChart({ data }: { data: any }) {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='hour' />
        <YAxis
          tickFormatter={(value: number) => `${(value / 1e6).toFixed(0)}M`}
        />
        <Tooltip
          content={<CustomTooltip />}
          formatter={(value: number) => formatCurrency(value)}
        />
        <Line type='monotone' dataKey='volume' stroke='#8884d8' />
      </LineChart>
    </ResponsiveContainer>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className='rounded-lg bg-white/95 p-2 shadow-lg'>
      <p className='text-sm text-purple-600'>
        volume: ${payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

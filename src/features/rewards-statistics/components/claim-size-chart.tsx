import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type * as Referral from '@/models/referral';

const COLORS = ['#7C3AED', '#22D3EE', '#F472B6', '#4ADE80'];

export function ClaimSizeChart({
  breakdown
}: {
  breakdown: Referral.ClaimAnalytics['breakdown'];
}) {
  const breakdownArray = Array.isArray(breakdown)
    ? breakdown
    : ([{}] as Referral.ClaimAnalytics['breakdown']);

  const claimSizeCategories = breakdownArray.reduce(
    (acc, item) => {
      if (item.tokenAverageClaimSize < 50) {
        acc.small.value += item.claimedAmount;
      } else if (item.tokenAverageClaimSize < 200) {
        acc.medium.value += item.claimedAmount;
      } else {
        acc.large.value += item.claimedAmount;
      }
      return acc;
    },
    {
      small: { name: 'Small Claims (<$50)', value: 0 },
      medium: { name: 'Medium Claims ($50-$200)', value: 0 },
      large: { name: 'Large Claims (>$200)', value: 0 }
    }
  );

  const pieChartData = Object.values(claimSizeCategories);

  return (
    <Card className='flex flex-col'>
      <CardHeader>
        <CardTitle>Claim Size Distribution</CardTitle>
      </CardHeader>
      <CardContent className='flex h-full w-full items-center justify-center'>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={pieChartData}
              cx='50%'
              cy='50%'
              labelLine={false}
              outerRadius={80}
              fill='#8884d8'
              dataKey='value'
            >
              {pieChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `$${Number(value).toLocaleString()}`}
            />
            <Legend layout='vertical' align='right' verticalAlign='middle' />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

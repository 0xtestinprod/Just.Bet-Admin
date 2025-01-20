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
  const claimSizeCategories = breakdown.reduce(
    (acc, item) => {
      if (item.tokenAverageClaimSize < 50) {
        acc.small.value += item.claimedAmount;
        acc.small.count += item.claimCount;
      } else if (item.tokenAverageClaimSize < 150) {
        acc.medium.value += item.claimedAmount;
        acc.medium.count += item.claimCount;
      } else {
        acc.large.value += item.claimedAmount;
        acc.large.count += item.claimCount;
      }
      return acc;
    },
    {
      small: { name: 'Small Claims (<$50)', value: 0, count: 0 },
      medium: { name: 'Medium Claims ($50-$150)', value: 0, count: 0 },
      large: { name: 'Large Claims (>$150)', value: 0, count: 0 }
    }
  );

  const pieChartData = Object.values(claimSizeCategories);

  return (
    <Card className='flex h-[400px] flex-col'>
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
              formatter={(value) =>
                `$${Number(value).toLocaleString()} (${pieChartData.find((item) => item.value === value)?.count} claims)`
              }
            />
            <Legend layout='vertical' align='right' verticalAlign='middle' />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

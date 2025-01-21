import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, DollarSign, Users } from 'lucide-react';
import * as Referral from '@/models/referral';

export default async function ReferralProgramDashboard() {
  const data = await Referral.getReferralStatistics();

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  return (
    <div className='flex w-full flex-col gap-4'>
      <div className='flex flex-col gap-4'>
        <h1>Referral Program Dashboard</h1>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Rewards
              </CardTitle>
              <Award className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                ${formatLargeNumber(data?.totalRewards || 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Average Spend
              </CardTitle>
              <DollarSign className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                ${formatLargeNumber(data?.averageSpend || 0)}
              </div>
            </CardContent>
          </Card>
          <Card className='md:col-span-2 lg:col-span-1'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Top Referrer
              </CardTitle>
              <Users className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='text-xs text-muted-foreground'>Address</div>
              <div className='truncate text-sm font-medium'>
                {data?.topReferrer?.address}
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <div className='text-xs text-muted-foreground'>Referrals</div>
                  <div className='text-lg font-bold'>
                    {data?.topReferrer?.referralCount}
                  </div>
                </div>
                <div>
                  <div className='text-xs text-muted-foreground'>Volume</div>
                  <div className='text-lg font-bold'>
                    ${formatLargeNumber(data?.topReferrer?.volume || 0)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

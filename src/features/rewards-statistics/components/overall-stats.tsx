import { Card, CardContent } from '@/components/ui/card';
import type * as Referral from '@/models/referral';
export function OverallStats({
  overall
}: {
  overall: Referral.ClaimAnalytics['overall'];
}) {
  return (
    <div className='grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardContent className='p-4'>
          <div className='text-sm font-medium'>Total Claim Percentage</div>
          <div className='text-2xl font-bold'>
            {overall?.totalClaimPercentage?.toFixed(2) ?? 0}%
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className='p-4'>
          <div className='text-sm font-medium'>Average Claim Size</div>
          <div className='text-2xl font-bold'>
            ${overall?.averageClaimSize?.toFixed(2) ?? 0}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function RewardsOverview() {
  // In a real application, you would fetch this data from your API
  const overallRewards = {
    totalAvailable: 10000,
    totalClaimed: 5000,
    rewardPercentage: 50.0
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Rewards</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div>
            <div className='mb-2 flex justify-between'>
              <span>Total Available</span>
              <span>${overallRewards.totalAvailable.toFixed(2)}</span>
            </div>
            <Progress value={100} className='h-2' />
          </div>
          <div>
            <div className='mb-2 flex justify-between'>
              <span>Total Claimed</span>
              <span>${overallRewards.totalClaimed.toFixed(2)}</span>
            </div>
            <Progress
              value={
                (overallRewards.totalClaimed / overallRewards.totalAvailable) *
                100
              }
              className='h-2'
            />
          </div>
          <div className='text-lg font-semibold'>
            Reward Percentage: {overallRewards.rewardPercentage.toFixed(2)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

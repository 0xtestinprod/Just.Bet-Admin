'use client';

import { OverallRewards } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Award, DollarSign, Percent } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

const formatCurrency = (value: number) => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export default function RewardsOverview({
  overallRewards
}: {
  overallRewards: OverallRewards;
}) {
  const isOverClaimed =
    overallRewards.totalClaimed > overallRewards.totalAvailable;

  const claimPercentage =
    (overallRewards.totalClaimed / overallRewards.totalAvailable) * 100;

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-bold'>Overall Rewards</h2>
      <div className='grid gap-4 md:grid-cols-3'>
        {/* Total Available Card */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Available
            </CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              ${formatCurrency(overallRewards.totalAvailable)}
            </div>
            <Progress value={100} className='mt-2 h-2' />
          </CardContent>
        </Card>

        {/* Total Claimed Card */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Claimed
              {isOverClaimed && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertTriangle className='ml-2 inline h-4 w-4 text-yellow-500' />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total claimed amount exceeds available rewards</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </CardTitle>
            <Award className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              ${formatCurrency(overallRewards.totalClaimed)}
            </div>
            <div
              className={`mt-2 h-2 w-full rounded-full bg-secondary ${isOverClaimed ? 'bg-yellow-500/20' : ''}`}
            >
              <div
                className={`h-full rounded-full ${isOverClaimed ? 'bg-yellow-500' : 'bg-primary'}`}
                style={{ width: `${Math.min(claimPercentage, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Reward Percentage Card */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Reward Percentage
            </CardTitle>
            <Percent className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatCurrency(overallRewards.rewardPercentage)}%
            </div>
            <Progress
              value={overallRewards.rewardPercentage}
              className='mt-2 h-2'
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

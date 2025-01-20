'use client';

import { OverallRewards } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

export default function RewardsOverview({
  overallRewards
}: {
  overallRewards: OverallRewards;
}) {
  const isOverClaimed =
    overallRewards.totalClaimed > overallRewards.totalAvailable;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          Overall Rewards
          {isOverClaimed && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertTriangle className='h-5 w-5 text-yellow-500' />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total claimed amount exceeds available rewards</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div>
            <div className='mb-2 flex justify-between'>
              <span>Total Available</span>
              <span>
                $
                {overallRewards.totalAvailable.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </div>
            <Progress value={100} className='h-2' />
          </div>
          <div>
            <div className='mb-2 flex justify-between'>
              <span>Total Claimed</span>
              <span>
                $
                {overallRewards.totalClaimed.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </div>
            <Progress
              value={100}
              className={`h-2 ${isOverClaimed ? 'bg-yellow-500' : ''}`}
            />
          </div>
          <div className='text-lg font-semibold'>
            Reward Percentage:{' '}
            {overallRewards.rewardPercentage.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
            %
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

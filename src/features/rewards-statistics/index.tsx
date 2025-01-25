import React from 'react';
import RewardPercentageStats from './components/reward-percentage-stats';
import ReferralRewardsPieChart from './components/referral-rewards-pie-chart';
import RewardsOverview from './components/rewards-overview';
import ClaimAnalytics from './components/claim-analytics';
import * as Referral from '@/models/referral';

export default async function RewardsStatisticsDashboard({
  authToken
}: {
  authToken?: string;
}) {
  const rewardsAnalytics = await Referral.getRewardsAnalytics(authToken);
  const claimAnalytics = await Referral.getClaimAnalytics(authToken);

  return (
    <div className='flex w-full flex-col gap-4'>
      <RewardsOverview overallRewards={rewardsAnalytics?.overallRewards} />
      <div className='flex flex-col gap-4 xl:flex-row'>
        <ReferralRewardsPieChart
          data={rewardsAnalytics?.rewardBreakdown || []}
          totalPendingRewards={rewardsAnalytics?.totalPendingRewards}
        />
        <RewardPercentageStats
          stats={rewardsAnalytics?.rewardPercentageStats}
        />
      </div>
      <ClaimAnalytics claimAnalytics={claimAnalytics} />
    </div>
  );
}

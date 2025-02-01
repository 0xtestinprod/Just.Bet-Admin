import React from 'react';
import ReferralRewardsPieChart from './components/referral-rewards-pie-chart';
import RewardsOverview from './components/rewards-overview';
import ClaimAnalytics from './components/claim-analytics';
import * as Referral from '@/models/referral';
import { getAllTokens } from '@/api';

export default async function RewardsStatisticsDashboard({
  authToken
}: {
  authToken?: string;
}) {
  const rewardsAnalytics = await Referral.getRewardsAnalytics(authToken);

  const claimAnalytics = await Referral.getClaimAnalytics(authToken);
  const tokens = await getAllTokens(authToken);

  return (
    <div className='flex w-full flex-col gap-4'>
      <RewardsOverview overallRewards={rewardsAnalytics?.overallRewards} />

      <ReferralRewardsPieChart
        data={rewardsAnalytics?.rewardBreakdown || []}
        totalPendingRewards={rewardsAnalytics?.totalPendingRewards}
        tokens={tokens}
      />
      {/* <RewardPercentageStats
          stats={rewardsAnalytics?.rewardPercentageStats}
        /> */}

      <ClaimAnalytics claimAnalytics={claimAnalytics} tokens={tokens} />
    </div>
  );
}

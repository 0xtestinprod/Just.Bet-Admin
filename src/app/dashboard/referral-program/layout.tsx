import PageContainer from '@/components/layout/page-container';
import React from 'react';

export default function OverViewLayout({
  referral_dashboard,
  reward_distribution,
  unclaimed_stats
}: {
  referral_dashboard: React.ReactNode;
  reward_distribution: React.ReactNode;
  unclaimed_stats: React.ReactNode;
}) {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4 pb-4'>
        {referral_dashboard}
        {reward_distribution}
        {unclaimed_stats}
      </div>
    </PageContainer>
  );
}

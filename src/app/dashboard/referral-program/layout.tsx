import PageContainer from '@/components/layout/page-container';
import React from 'react';

export default function OverViewLayout({
  referral_dashboard,
  reward_distribution
}: {
  referral_dashboard: React.ReactNode;
  reward_distribution: React.ReactNode;
}) {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4 pb-4'>
        {referral_dashboard}
        {reward_distribution}
      </div>
    </PageContainer>
  );
}

import PageContainer from '@/components/layout/page-container';
import React from 'react';

export default function OverViewLayout({
  referral_dashboard
}: {
  referral_dashboard: React.ReactNode;
}) {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>{referral_dashboard}</div>
    </PageContainer>
  );
}

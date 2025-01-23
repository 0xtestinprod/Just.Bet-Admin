import PageContainer from '@/components/layout/page-container';
import React from 'react';

export default function OverViewLayout({
  volume_stats
}: {
  volume_stats: React.ReactNode;
}) {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>{volume_stats}</div>
    </PageContainer>
  );
}

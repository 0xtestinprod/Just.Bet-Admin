import PageContainer from '@/components/layout/page-container';
import React from 'react';

export default function OverViewLayout({
  game_performance
}: {
  game_performance: React.ReactNode;
}) {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>{game_performance}</div>
    </PageContainer>
  );
}

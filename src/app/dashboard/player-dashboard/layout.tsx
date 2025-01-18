import PageContainer from '@/components/layout/page-container';
import React from 'react';

export default function OverViewLayout({
  player_behaviour,
  player_growth,
  player_stats
}: {
  player_behaviour: React.ReactNode;
  player_growth: React.ReactNode;
  player_stats: React.ReactNode;
}) {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-10'>
        {player_behaviour}
        {/* {player_growth} */}
        {player_stats}
      </div>
    </PageContainer>
  );
}

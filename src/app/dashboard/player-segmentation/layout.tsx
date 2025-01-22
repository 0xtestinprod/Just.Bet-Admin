import PageContainer from '@/components/layout/page-container';
import React from 'react';

export default function OverViewLayout({
  player_segmentation
}: {
  player_segmentation: React.ReactNode;
}) {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        {player_segmentation}
      </div>
    </PageContainer>
  );
}

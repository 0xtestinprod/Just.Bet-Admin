'use client';

import { TokenSelector } from '@/components/ui/token-selector';
import { mockTokens } from 'utils/mockData';
import { useState } from 'react';
import { TokenPerformance } from 'utils/mockData';
import GamePerformanceTable from '@/components/ui/game-performance-table';
import TokenPerformanceTable from '@/components/ui/token-performance-table';
export default function Page() {
  const [selectedToken, setSelectedToken] = useState<TokenPerformance | null>(
    null
  );

  return (
    <div className='flex flex-col space-y-8'>
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <h1 className='text-2xl font-bold'>Game Performance Dashboard</h1>
      </div>
      <GamePerformanceTable tokenPerformance={mockTokens} />
      <div className='justify-end self-end'>
        <TokenSelector
          tokens={mockTokens}
          selectedToken={selectedToken}
          onSelectToken={setSelectedToken}
        />
      </div>

      {selectedToken && (
        <TokenPerformanceTable tokenPerformance={selectedToken} />
      )}
    </div>
  );
}

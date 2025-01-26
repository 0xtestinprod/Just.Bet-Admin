'use client';

import { useCallback, useState } from 'react';
import { useGetGamePerformance } from '@/models/game-performance';
import { useGetAllTokens } from '@/models/token';
import { Token, useGetGamePerformanceByToken } from '@/api';
import { TokenSelector } from './components/token-selector';
import { GamePerformanceTable } from './components/game-performance-table';

export default function GamePerformanceDashboard({
  authToken
}: {
  authToken: string;
}) {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const {
    data: gamePerformance,
    loading: gameLoading,
    error: gameError
  } = useGetGamePerformance(authToken);

  const handleTokenSelect = useCallback((token: Token | null) => {
    setSelectedToken(token);
  }, []);

  const { data: tokens, loading: tokensLoading } = useGetAllTokens(authToken);

  const {
    data: tokenPerformance,
    loading: tokenPerformanceLoading,
    error: tokenPerformanceError
  } = useGetGamePerformanceByToken(selectedToken?.address || '', authToken, [
    selectedToken?.address
  ]);

  return (
    <div className='flex flex-col space-y-8'>
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <h1 className='text-2xl font-bold'>Game Performance Dashboard</h1>
        <div className='w-full sm:w-72'>
          <TokenSelector
            tokens={tokens || []}
            selectedToken={selectedToken}
            onSelectToken={handleTokenSelect}
            isLoading={tokensLoading}
          />
        </div>
      </div>

      <GamePerformanceTable
        data={gamePerformance || []}
        isLoading={gameLoading}
        error={gameError}
      />

      {selectedToken && (
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold'>
            Performance for {selectedToken.symbol} ({selectedToken.address})
          </h2>
          <GamePerformanceTable
            data={tokenPerformance || []}
            isLoading={tokenPerformanceLoading}
            error={tokenPerformanceError}
          />
        </div>
      )}
    </div>
  );
}

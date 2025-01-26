/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { GamePerformanceResponse, Token } from '@/api';
import { TokenSelector } from './components/token-selector';
import { GamePerformanceTable } from './components/game-performance-table';
import { axiosInstance } from '@/lib/axios';
import { useEffect } from 'react';

export default function GamePerformanceDashboard({
  authToken
}: {
  authToken: string;
}) {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [data, setData] = useState({
    games: [] as GamePerformanceResponse[],
    tokens: [] as Token[],
    tokenGames: [] as GamePerformanceResponse[]
  });
  const [loadingStates, setLoadingStates] = useState({
    initial: true,
    token: false
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [gamesRes, tokensRes] = await Promise.all([
          axiosInstance.get('games/stats/performance', {
            headers: { Authorization: `Bearer ${authToken}` }
          }),
          axiosInstance.get('token/all', {
            headers: { Authorization: `Bearer ${authToken}` }
          })
        ]);

        const games = Array.isArray(gamesRes.data.data)
          ? gamesRes.data.data
          : [];
        const tokens = Array.isArray(tokensRes.data.data)
          ? tokensRes.data.data
          : [];

        setData((prev) => ({
          ...prev,
          games,
          tokens
        }));
      } catch (error) {
      } finally {
        setLoadingStates((prev) => ({ ...prev, initial: false }));
      }
    }

    fetchData();
  }, [authToken]);

  useEffect(() => {
    if (!selectedToken) {
      setData((prev) => ({ ...prev, tokenGames: [] }));
      return;
    }

    setLoadingStates((prev) => ({ ...prev, token: true }));
    axiosInstance
      .get(`games/stats/performance/token/${selectedToken.address}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      })
      .then((res) => {
        const tokenGames = Array.isArray(res.data.data) ? res.data.data : [];
        setData((prev) => ({ ...prev, tokenGames }));
      })
      .catch((error) => {
        setData((prev) => ({ ...prev, tokenGames: [] }));
      })
      .finally(() => {
        setLoadingStates((prev) => ({ ...prev, token: false }));
      });
  }, [selectedToken, authToken]);

  return (
    <div className='flex flex-col space-y-8'>
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <h1 className='text-2xl font-bold'>Game Performance Dashboard</h1>
        <div className='w-full sm:w-72'>
          <TokenSelector
            tokens={data.tokens || []}
            selectedToken={selectedToken}
            onSelectToken={setSelectedToken}
            isLoading={loadingStates.initial}
          />
        </div>
      </div>

      <GamePerformanceTable
        data={data.games || []}
        isLoading={loadingStates.initial}
      />

      {selectedToken && (
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold'>
            Performance for {selectedToken.symbol} ({selectedToken.address})
          </h2>
          <GamePerformanceTable
            data={data.tokenGames || []}
            isLoading={loadingStates.token}
          />
        </div>
      )}
    </div>
  );
}

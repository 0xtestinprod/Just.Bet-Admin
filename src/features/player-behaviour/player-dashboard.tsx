'use client';

import * as PlayerBehavior from '@/models/player-behavior';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowDown, ArrowUp, Coins, DollarSign, Gamepad2 } from 'lucide-react';
import { PlayerCombobox } from './components/player-combox';
import { cn } from '@/lib/utils';

interface PlayerDashboardProps {
  initialPlayers: string[];
  authToken?: string;
}

export default function PlayerDashboard({
  initialPlayers,
  authToken
}: PlayerDashboardProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string>(
    initialPlayers[0] ?? ''
  );

  const queryInput = {
    address: selectedPlayer
  };

  const { data: dashboardData } = PlayerBehavior.useGetPlayerBehaviorDashboard(
    queryInput,
    [selectedPlayer],
    authToken
  );

  console.log(dashboardData);

  return (
    <div className='flex w-full flex-col gap-4 overflow-y-auto'>
      <div className='flex w-full flex-col gap-4'>
        <div className='flex w-full flex-col justify-between gap-4 sm:flex-row'>
          <h1 className='text-2xl font-bold tracking-tight'>Player Behavior</h1>
          <PlayerCombobox
            players={initialPlayers.map((address) => ({
              id: address,
              address
            }))}
            selectedPlayer={selectedPlayer}
            setSelectedPlayer={setSelectedPlayer}
          />
        </div>

        <Tabs defaultValue='overview' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='financial'>Financial</TabsTrigger>
            <TabsTrigger value='betting'>Betting</TabsTrigger>
            <TabsTrigger value='tokens'>Token Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <StatCard
                title='Total Games'
                value={dashboardData?.overview?.totalGamesPlayed ?? 0}
                icon={Gamepad2}
              />
              <StatCard
                title='Win/Loss Ratio'
                value={(dashboardData?.betting?.winLossRatioGame ?? 0).toFixed(
                  2
                )}
                subValue={`${((dashboardData?.betting?.winLossRatioGame ?? 0) * 100).toFixed(0)}% win rate`}
                icon={ArrowUp}
              />
              <StatCard
                title='Lifetime Value'
                value={`$${dashboardData?.overview?.lifetimeValue?.toFixed(2) ?? '0.00'}`}
                subValue={`${dashboardData?.overview?.uniqueTokensUsed} unique tokens used`}
                icon={DollarSign}
                valueClassName={
                  (dashboardData?.overview?.lifetimeValue ?? 0) < 0
                    ? 'text-red-500'
                    : ''
                }
              />
              <StatCard
                title='Avg Bet Amount (USD)'
                value={`$${dashboardData?.betting?.averageBetAmountUsd?.toFixed(2) ?? '0.00'}`}
                subValue={`Per game: $${dashboardData?.betting?.averageBetPerGame?.toFixed(2) ?? '0.00'}`}
                icon={Coins}
              />
            </div>
          </TabsContent>

          <TabsContent value='financial' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <StatCard
                title='Total Deposits'
                value={`$${(dashboardData?.financial?.totalDepositsUsd ?? 0).toLocaleString()}`}
                subValue={`${dashboardData?.financial?.largeDeposits} large deposits`}
                icon={ArrowUp}
              />
              <StatCard
                title='Total Withdrawals'
                value={`$${(dashboardData?.financial?.totalWithdrawsUsd ?? 0).toLocaleString()}`}
                subValue={`${dashboardData?.financial?.largeWithdraws} large withdrawals`}
                icon={ArrowDown}
              />
            </div>
          </TabsContent>

          <TabsContent value='betting' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle>Betting Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm'>Average Bet (USD)</span>
                      <span className='font-medium'>
                        $
                        {dashboardData?.betting?.averageBetAmountUsd?.toFixed(
                          2
                        ) ?? '0.00'}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm'>Bet Per Game</span>
                      <span className='font-medium'>
                        $
                        {dashboardData?.betting?.averageBetPerGame?.toFixed(
                          2
                        ) ?? '0.00'}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm'>Win/Loss Ratio</span>
                      <span className='font-medium'>
                        {dashboardData?.betting?.winLossRatioGame?.toFixed(2) ??
                          '0.00'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='tokens' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-1'>
              <Card>
                <CardHeader>
                  <CardTitle>Token Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {dashboardData?.tokenBreakdowns?.map((token) => (
                      <div
                        key={token.tokenSymbol}
                        className='flex flex-col space-y-2'
                      >
                        <div className='flex items-center justify-between'>
                          <span className='font-medium'>
                            {token.tokenSymbol}
                          </span>
                          <span className='text-sm text-muted-foreground'>
                            {token.percentage}% of volume
                          </span>
                        </div>
                        <div className='flex items-center justify-between text-sm'>
                          <span>
                            Deposits: ${token.depositsUsd.toLocaleString()}
                          </span>
                          <span>
                            Withdrawals: $
                            {token.withdrawalsUsd.toLocaleString()}
                          </span>
                        </div>
                        <div className='h-2 w-full rounded-full bg-secondary'>
                          <div
                            className='h-full rounded-full bg-primary'
                            style={{ width: `${token.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const StatCard = React.memo(
  ({
    title,
    value,
    subValue,
    icon: Icon,
    valueClassName = ''
  }: {
    title: string;
    value: string | number;
    subValue?: string;
    icon: React.ElementType;
    valueClassName?: string;
  }) => (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className={cn('text-2xl font-bold', valueClassName)}>{value}</div>
        {subValue && (
          <p className='text-xs text-muted-foreground'>{subValue}</p>
        )}
      </CardContent>
    </Card>
  )
);

StatCard.displayName = 'StatCard';

'use client';

import * as PlayerBehavior from '@/models/player-behavior';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowDown,
  ArrowUp,
  Clock,
  Coins,
  DollarSign,
  Gamepad2,
  Repeat,
  Users
} from 'lucide-react';
import { useState } from 'react';
import { PlayerCombobox } from './components/player-combox';

export interface Player {
  id: string;
  address: string;
}

export interface TimeRange {
  label: string;
  value: 'day' | 'week' | 'month';
}

// Sample data - in real app this would come from API
const players: Player[] = [
  { id: '1', address: '0x220C795ee1af2B279d420eEAc7e16C79c6b90836' },
  { id: '2', address: '0xE8b40b9cCb6615453A7d83e1B11B3B698206BB3E' },
  { id: '3', address: '0x33Ff4D0d25199014F28655830796Fe4D4e0845cd' },
  { id: '4', address: '0x33Ff4D0d25199014F28655830796Fe4D4e0845cd' },
  { id: '5', address: '0x33Ff4D0d25199014F28655830796Fe4D4e0845cd' },
  { id: '6', address: '0x33Ff4D0d25199014F28655830796Fe4D4e0845cd' },
  { id: '7', address: '0x33Ff4D0d25199014F28655830796Fe4D4e0845cd' },
  { id: '8', address: '0x33Ff4D0d25199014F28655830796Fe4D4e0845cd' },
  { id: '9', address: '0x33Ff4D0d25199014F28655830796Fe4D4e0845cd' },
  { id: '10', address: '0x33Ff4D0d25199014F28655830796Fe4D4e0845cd' },
  { id: '11', address: '0x33Ff4D0d25199014F28655830796Fe4D4e0845cd' }
];

const timeRanges: TimeRange[] = [
  { label: 'Last 24 Hours', value: 'day' },
  { label: 'Last Week', value: 'week' },
  { label: 'Last Month', value: 'month' }
];

const getTimeRange = (
  range: TimeRange['value']
): { timeFrom: number; timeTo: number } => {
  const now = Math.floor(Date.now() / 1000); // Convert to seconds
  const oneDay = 24 * 60 * 60; // seconds in a day

  switch (range) {
    case 'day':
      return { timeFrom: now - oneDay, timeTo: now };
    case 'week':
      return { timeFrom: now - 7 * oneDay, timeTo: now };
    case 'month':
      return { timeFrom: now - 30 * oneDay, timeTo: now };
    default:
      return { timeFrom: now - oneDay, timeTo: now };
  }
};

export default function PlayerDashboard() {
  const [selectedPlayer, setSelectedPlayer] = useState<string>(
    players[0].address
  );
  const [selectedTimeRange, setSelectedTimeRange] =
    useState<TimeRange['value']>('day');

  const { timeFrom, timeTo } = getTimeRange(selectedTimeRange);

  const {
    data: dashboardData,
    loading,
    error
  } = PlayerBehavior.useGetPlayerBehaviorDashboard({
    address: selectedPlayer,
    timeFrom: 1736601705,
    timeTo: 1736607405
  });

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>Loading...</div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center p-8 text-red-500'>
        Error loading dashboard data: {error.message}
      </div>
    );
  }

  return (
    <div className='flex w-full flex-col gap-4'>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col justify-between gap-4 sm:flex-row'>
          <h1 className='text-2xl font-bold tracking-tight'>
            Player Dashboard
          </h1>
          <div className='flex flex-col gap-4 sm:flex-row'>
            <PlayerCombobox
              players={players}
              selectedPlayer={selectedPlayer}
              setSelectedPlayer={setSelectedPlayer}
            />

            <Tabs
              value={selectedTimeRange}
              className='w-full sm:w-auto'
              onValueChange={(value) =>
                setSelectedTimeRange(value as TimeRange['value'])
              }
            >
              <TabsList>
                {timeRanges.map((range) => (
                  <TabsTrigger key={range.value} value={range.value}>
                    {range.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        <Tabs defaultValue='overview' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='financial'>Financial</TabsTrigger>
            <TabsTrigger value='betting'>Betting</TabsTrigger>
            <TabsTrigger value='session'>Session</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Games
                  </CardTitle>
                  <Gamepad2 className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {dashboardData?.overview?.totalGamesPlayed ?? 0}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Current streak:{' '}
                    {dashboardData?.overview?.currentStreak ?? -1} games
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Win/Loss Ratio
                  </CardTitle>
                  <ArrowUp className='h-4 w-4 text-green-500' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {dashboardData?.overview.winLossRatio?.toFixed(2) ?? '0.00'}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {(
                      (dashboardData?.overview.winLossRatio ?? 0) * 100
                    ).toFixed(0)}
                    % win rate
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Lifetime Value
                  </CardTitle>
                  <DollarSign className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${
                      (dashboardData?.overview.lifetimeValue ?? 0) < 0
                        ? 'text-red-500'
                        : ''
                    }`}
                  >
                    $
                    {dashboardData?.overview.lifetimeValue?.toFixed(2) ??
                      '0.00'}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {dashboardData?.overview.uniqueTokensUsed} unique tokens
                    used
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Avg Bet Amount
                  </CardTitle>
                  <Coins className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    $
                    {dashboardData?.betting?.averageBetAmountUsd?.toFixed(2) ??
                      '0.00'}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Per game: $
                    {dashboardData?.betting?.betPerGame?.toFixed(2) ?? '0.00'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='session' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Sessions
                  </CardTitle>
                  <Clock className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {dashboardData?.session?.totalSessions ?? 0}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Avg Session Duration
                  </CardTitle>
                  <Clock className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {Math.floor(
                      (dashboardData?.session.averageSessionDuration ?? 0) /
                        3600
                    )}
                    h
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Total:{' '}
                    {Math.floor(
                      (dashboardData?.session.totalPlayTime ?? 0) / 3600
                    )}
                    h played
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Betting Streaks
                  </CardTitle>
                  <Repeat className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {dashboardData?.session?.averageBettingStreak?.toFixed(1) ??
                      '0.0'}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Average streak length
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='financial' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle>Deposits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    {dashboardData?.financial?.deposits?.map((deposit, i) => (
                      <div
                        key={i}
                        className='flex items-center justify-between py-2'
                      >
                        <div className='space-y-1'>
                          <p className='text-sm font-medium leading-none'>
                            {deposit?.token ?? 'Unknown'}
                          </p>
                          <p className='text-sm text-muted-foreground'>
                            {new Date(
                              deposit?.timestamp ?? 0
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div className='flex items-center gap-2'>
                          <ArrowUp className='h-4 w-4 text-green-500' />
                          <span className='font-medium'>
                            ${deposit?.amountUsd?.toFixed(2) ?? '0.00'}
                          </span>
                        </div>
                      </div>
                    )) ?? []}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Withdrawals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    {dashboardData?.financial?.withdrawals?.map(
                      (withdrawal, i) => (
                        <div
                          key={i}
                          className='flex items-center justify-between py-2'
                        >
                          <div className='space-y-1'>
                            <p className='text-sm font-medium leading-none'>
                              {withdrawal?.token ?? 'Unknown'}
                            </p>
                            <p className='text-sm text-muted-foreground'>
                              {new Date(
                                withdrawal?.timestamp ?? 0
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className='flex items-center gap-2'>
                            <ArrowDown className='h-4 w-4 text-red-500' />
                            <span className='font-medium'>
                              ${withdrawal?.amountUsd?.toFixed(2) ?? '0.00'}
                            </span>
                          </div>
                        </div>
                      )
                    ) ?? []}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='betting' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle>Betting Streaks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm'>Max Win Streak</span>
                      <span className='font-medium text-green-500'>
                        {dashboardData?.betting?.maxWinStreak ?? 0} games
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm'>Max Lose Streak</span>
                      <span className='font-medium text-red-500'>
                        {dashboardData?.betting?.maxLoseStreak ?? 0} games
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Betting Amounts</CardTitle>
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
                        {dashboardData?.betting?.betPerGame?.toFixed(2) ??
                          '0.00'}
                      </span>
                    </div>
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

'use client';

import * as PlayerBehavior from '@/models/player-behavior';
import React, { useState, useEffect, useMemo } from 'react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowDown,
  ArrowUp,
  Clock,
  Coins,
  DollarSign,
  Gamepad2,
  Repeat
} from 'lucide-react';
import { PlayerCombobox } from './components/player-combox';
import { DashboardStatisticsResponse } from '@/models/player-behavior';
import { ApiResponse } from '@/api';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export interface TimeRange {
  label: string;
  value: 'day' | 'week' | 'month';
}

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

interface PlayerDashboardProps {
  initialPlayers: string[];
}

export default function PlayerDashboard({
  initialPlayers
}: PlayerDashboardProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string>(
    initialPlayers[0]
  );
  const [selectedTimeRange, setSelectedTimeRange] =
    useState<TimeRange['value']>('day');

  // Keep track of the last successful data
  const [stableData, setStableData] =
    React.useState<DashboardStatisticsResponse | null>(null);

  const [searchAddress, setSearchAddress] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    if (initialPlayers && initialPlayers.length > 0) {
      setSelectedPlayer(initialPlayers[0]);
    }
  }, [initialPlayers]);

  const { timeFrom, timeTo } = getTimeRange(selectedTimeRange);

  const queryInput = useMemo(
    () => ({
      address: selectedPlayer,
      timeFrom,
      timeTo
    }),
    [selectedPlayer, timeFrom, timeTo]
  );

  const { data: dashboardData, error } =
    PlayerBehavior.useGetPlayerBehaviorDashboard(queryInput, [
      selectedPlayer,
      timeFrom,
      timeTo
    ]);
  console.log(dashboardData);
  // Update stable data when we get new data
  React.useEffect(() => {
    if (dashboardData) {
      setStableData(dashboardData);
    }
  }, [dashboardData]);

  // Use stableData instead of dashboardData in your render
  const data = (stableData as ApiResponse<DashboardStatisticsResponse> | null)
    ?.data;

  const calculatePlayerGrowth = (data: DashboardStatisticsResponse) => {
    if (!data?.financial) return [];

    const transactions = [
      ...(data.financial.deposits ?? []),
      ...(data.financial.withdrawals ?? [])
    ].sort((a, b) => a.timestamp - b.timestamp);

    // Group transactions based on selected time range
    const groups = new Map<string, number>();
    let total = 0;

    transactions.forEach((tx) => {
      const date = new Date(tx.timestamp * 1000);
      let key = '';

      switch (selectedTimeRange) {
        case 'day':
          // Group by hour for last 24 hours
          key = date.getHours().toString().padStart(2, '0') + ':00';
          break;
        case 'week':
          // Group by day for last week
          key = date.toLocaleDateString('en-US', { weekday: 'short' });
          break;
        case 'month':
          // Group by day and month for last month
          key = `${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })}`;
          break;
      }

      total += tx.amountUsd;
      groups.set(key, total);
    });

    return Array.from(groups.entries()).map(([label, value]) => ({
      label,
      value
    }));
  };

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
          <h1 className='text-2xl font-bold tracking-tight'>Player Behavior</h1>
          <div className='flex flex-col gap-4 sm:flex-row'>
            <PlayerCombobox
              players={initialPlayers.map((address) => ({
                id: address,
                address
              }))}
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
                    {data?.overview?.totalGamesPlayed ?? 0}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Current streak: {data?.overview?.currentStreak ?? -1} games
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
                    {data?.overview?.winLossRatio?.toFixed(2) ?? '0.00'}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {((data?.overview?.winLossRatio ?? 0) * 100).toFixed(0)}%
                    win rate
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
                      (data?.overview?.lifetimeValue ?? 0) < 0
                        ? 'text-red-500'
                        : ''
                    }`}
                  >
                    ${data?.overview?.lifetimeValue?.toFixed(2) ?? '0.00'}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {data?.overview?.uniqueTokensUsed} unique tokens used
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
                    ${data?.betting?.averageBetAmountUsd?.toFixed(2) ?? '0.00'}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Per game: ${data?.betting?.betPerGame?.toFixed(2) ?? '0.00'}
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
                    {data?.session?.totalSessions ?? 0}
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
                      (data?.session?.averageSessionDuration ?? 0) / 3600
                    )}
                    h
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Total:{' '}
                    {Math.floor((data?.session?.totalPlayTime ?? 0) / 3600)}h
                    played
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
                    {data?.session?.averageBettingStreak?.toFixed(1) ?? '0.0'}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Average streak length
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='financial' className='space-y-4'>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-wrap justify-between gap-4'>
                <Input
                  placeholder='Search by address'
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  className='w-full sm:w-auto'
                />
                <div className='flex gap-2'>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Sort by' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='date'>Date</SelectItem>
                      <SelectItem value='value'>Value</SelectItem>
                    </SelectContent>
                  </Select>
                  <div
                    className='flex cursor-pointer items-center justify-center'
                    onClick={() =>
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                    }
                  >
                    {sortOrder === 'asc' ? (
                      <ArrowUp className='h-4 w-4' />
                    ) : (
                      <ArrowDown className='h-4 w-4' />
                    )}
                  </div>
                </div>
              </div>
              <div className='grid gap-4 md:grid-cols-2'>
                <Card>
                  <CardHeader>
                    <CardTitle>Deposits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='scrollbar-thin max-h-[200px] space-y-2 overflow-y-auto'>
                      {data?.financial?.deposits
                        ?.filter((deposit) =>
                          deposit.token
                            .toLowerCase()
                            .includes(searchAddress.toLowerCase())
                        )
                        ?.sort((a, b) => {
                          if (sortBy === 'date') {
                            return sortOrder === 'asc'
                              ? a.timestamp - b.timestamp
                              : b.timestamp - a.timestamp;
                          } else {
                            return sortOrder === 'asc'
                              ? a.amountUsd - b.amountUsd
                              : b.amountUsd - a.amountUsd;
                          }
                        })
                        ?.map((deposit, i) => (
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
                    <div className='scrollbar-thin max-h-[200px] space-y-2 overflow-y-auto'>
                      {data?.financial?.withdrawals
                        ?.filter((withdrawal) =>
                          withdrawal.token
                            .toLowerCase()
                            .includes(searchAddress.toLowerCase())
                        )
                        ?.sort((a, b) => {
                          if (sortBy === 'date') {
                            return sortOrder === 'asc'
                              ? a.timestamp - b.timestamp
                              : b.timestamp - a.timestamp;
                          } else {
                            return sortOrder === 'asc'
                              ? a.amountUsd - b.amountUsd
                              : b.amountUsd - a.amountUsd;
                          }
                        })
                        ?.map((withdrawal, i) => (
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
                                ${withdrawal?.amount?.toFixed(2) ?? '0.00'}
                              </span>
                            </div>
                          </div>
                        )) ?? []}
                    </div>
                  </CardContent>
                </Card>
              </div>
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
                        {data?.betting?.maxWinStreak ?? 0} games
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm'>Max Lose Streak</span>
                      <span className='font-medium text-red-500'>
                        {data?.betting?.maxLoseStreak ?? 0} games
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
                        {data?.betting?.averageBetAmountUsd?.toFixed(2) ??
                          '0.00'}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm'>Bet Per Game</span>
                      <span className='font-medium'>
                        ${data?.betting?.betPerGame?.toFixed(2) ?? '0.00'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className='text-white'>
              Player Net Balance Over Time
            </CardTitle>
            <p className='text-sm text-gray-400'>
              deposits and withdrawals in USD ($)
            </p>
          </CardHeader>
          <CardContent>
            <div className='h-[300px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart
                  data={calculatePlayerGrowth(
                    data as DashboardStatisticsResponse
                  )}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis
                    dataKey='label'
                    stroke='#666'
                    tick={{ fill: '#666' }}
                    interval={0}
                    angle={-45}
                    textAnchor='end'
                    height={60}
                  />
                  <YAxis
                    stroke='#666'
                    tick={{ fill: '#666' }}
                    tickFormatter={(value) => `$${value.toFixed(2)}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value) => [
                      `$${Number(value).toFixed(2)}`,
                      'Balance'
                    ]}
                    labelFormatter={(label) => label}
                  />
                  <Line
                    type='monotone'
                    dataKey='value'
                    stroke='#4ade80'
                    strokeWidth={2}
                    dot={{ fill: '#4ade80', r: 4 }}
                    activeDot={{ r: 6 }}
                    name='Balance'
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

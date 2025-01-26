'use client';

import * as PlayerBehavior from '@/models/player-behavior';
import React, { useState, useCallback, useMemo } from 'react';
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
import { cn } from '@/lib/utils';

export interface TimeRange {
  label: string;
  value: 'day' | 'week' | 'month';
}

const timeRanges: TimeRange[] = [
  { label: 'Last 24 Hours', value: 'day' },
  { label: 'Last Week', value: 'week' },
  { label: 'Last Month', value: 'month' }
] as const;

const ONE_DAY = 24 * 60 * 60;

const getTimeRange = (
  range: TimeRange['value']
): { timeFrom: number; timeTo: number } => {
  const now = Math.floor(Date.now() / 1000);

  switch (range) {
    case 'day':
      return { timeFrom: now - ONE_DAY, timeTo: now };
    case 'week':
      return { timeFrom: now - 7 * ONE_DAY, timeTo: now };
    case 'month':
      return { timeFrom: now - 30 * ONE_DAY, timeTo: now };
    default:
      return { timeFrom: now - ONE_DAY, timeTo: now };
  }
};

const getDateKey = (date: Date, timeRange: TimeRange['value']): string => {
  switch (timeRange) {
    case 'day':
      return date.getHours().toString().padStart(2, '0') + ':00';
    case 'week':
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    case 'month':
      return `${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })}`;
  }
};

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
  const [selectedTimeRange, setSelectedTimeRange] =
    useState<TimeRange['value']>('day');
  const [searchAddress, setSearchAddress] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');

  const timeRange = useMemo(
    () => getTimeRange(selectedTimeRange),
    [selectedTimeRange]
  );

  const queryInput = useMemo(
    () => ({
      address: selectedPlayer,
      timeFrom: timeRange.timeFrom,
      timeTo: timeRange.timeTo
    }),
    [selectedPlayer, timeRange]
  );

  const { data: dashboardData, error } =
    PlayerBehavior.useGetPlayerBehaviorDashboard(
      queryInput,
      [selectedPlayer, timeRange.timeFrom, timeRange.timeTo],
      authToken
    );

  const playerGrowthData = useMemo(() => {
    if (!dashboardData?.financial) return [];

    const transactions = [
      ...(dashboardData.financial.deposits ?? []),
      ...(dashboardData.financial.withdrawals ?? [])
    ].sort((a, b) => a.timestamp - b.timestamp);

    const groups = new Map<string, number>();
    let total = 0;

    transactions.forEach((tx) => {
      const date = new Date(tx.timestamp * 1000);
      const key = getDateKey(date, selectedTimeRange);
      total += tx.amountUsd;
      groups.set(key, total);
    });

    return Array.from(groups.entries()).map(([label, value]) => ({
      label,
      value
    }));
  }, [dashboardData?.financial, selectedTimeRange]);

  // Memoize filtered transactions
  const filteredTransactions = useMemo(() => {
    if (!dashboardData?.financial) return { deposits: [], withdrawals: [] };

    const searchLower = searchAddress.toLowerCase();
    const sortFn = (a: any, b: any) => {
      const aValue = sortBy === 'date' ? a.timestamp : a.amountUsd;
      const bValue = sortBy === 'date' ? b.timestamp : b.amountUsd;
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    };

    return {
      deposits:
        dashboardData.financial.deposits
          ?.filter((d) => d.token.toLowerCase().includes(searchLower))
          ?.sort(sortFn) ?? [],
      withdrawals:
        dashboardData.financial.withdrawals
          ?.filter((w) => w.token.toLowerCase().includes(searchLower))
          ?.sort(sortFn) ?? []
    };
  }, [dashboardData?.financial, searchAddress, sortBy, sortOrder]);

  const handleTimeRangeChange = useCallback((value: string) => {
    setSelectedTimeRange(value as TimeRange['value']);
  }, []);

  const handleSortOrderToggle = useCallback(() => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  return (
    <div className='flex w-full flex-col gap-4 overflow-y-auto'>
      <div className='flex w-full flex-col gap-4'>
        <div className='flex w-full flex-col justify-between gap-4 sm:flex-row'>
          <h1 className='text-2xl font-bold tracking-tight'>Player Behavior</h1>
          <div className='flex w-full flex-col gap-4 sm:flex-row'>
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
              onValueChange={handleTimeRangeChange}
            >
              <TabsList className='w-full sm:w-auto'>
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
              <StatCard
                title='Total Games'
                value={dashboardData?.overview?.totalGamesPlayed ?? 0}
                subValue={`Current streak: ${dashboardData?.overview?.currentStreak ?? -1} games`}
                icon={Gamepad2}
              />
              <StatCard
                title='Win/Loss Ratio'
                value={
                  dashboardData?.overview?.winLossRatio?.toFixed(2) ?? '0.00'
                }
                subValue={`${((dashboardData?.overview?.winLossRatio ?? 0) * 100).toFixed(0)}% win rate`}
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
                title='Avg Bet Amount'
                value={`$${dashboardData?.betting?.averageBetAmountUsd?.toFixed(2) ?? '0.00'}`}
                subValue={`Per game: $${dashboardData?.betting?.betPerGame?.toFixed(2) ?? '0.00'}`}
                icon={Coins}
              />
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
                      (dashboardData?.session?.averageSessionDuration ?? 0) /
                        3600
                    )}
                    h
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Total:{' '}
                    {Math.floor(
                      (dashboardData?.session?.totalPlayTime ?? 0) / 3600
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
                    onClick={handleSortOrderToggle}
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
                      {filteredTransactions.deposits.map((deposit, i) => (
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
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Withdrawals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='scrollbar-thin max-h-[200px] space-y-2 overflow-y-auto'>
                      {filteredTransactions.withdrawals.map((withdrawal, i) => (
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
                      ))}
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
                  data={playerGrowthData}
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
                    stroke='#b27aff'
                    strokeWidth={2}
                    dot={{ fill: '#b27aff', r: 4 }}
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

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { HourlyVolumeChart } from './components/hourly-volume-chart';
import { GameStatsTable } from './components/game-stats-table';
import { GameVolumeChart } from './components/game-volume-chart';
import * as Volume from '@/models/volume';

export default function VolumeStatsDashboard() {
  const [date, setDate] = useState<DateRange | undefined>();

  const timeFrom = date?.from
    ? Math.floor(date.from.getTime() / 1000)
    : undefined;
  const timeTo = date?.to ? Math.floor(date.to.getTime() / 1000) : undefined;

  const { data: volumeStats, loading: volumeLoading } =
    Volume.useGetVolumeStats(timeFrom, timeTo);

  const { data: hourlyData, loading: hourlyLoading } =
    Volume.useGetHourlyVolumeDistribution(timeFrom, timeTo);

  if (volumeLoading || hourlyLoading) {
    return null;
  }

  return (
    <div className='container mx-auto py-10'>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='text-4xl font-bold'>Volume Dashboard</h1>
        <DatePickerWithRange date={date} setDate={setDate} />
      </div>

      <div className='mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle>Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-4xl font-bold'>
              {formatCurrency(volumeStats?.totalVolume ?? 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Volume by Game</CardTitle>
          </CardHeader>
          <CardContent>
            <GameVolumeChart data={volumeStats?.volumeByGame ?? []} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Hourly Volume Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <HourlyVolumeChart data={hourlyData ?? []} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Game Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <GameStatsTable data={volumeStats?.volumeByGame ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}

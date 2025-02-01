'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { GameStatsTable } from './components/game-stats-table';
import { GameVolumeChart } from './components/game-volume-chart';
import * as Volume from '@/models/volume';
import { BarGraphSkeleton } from '../overview/components/bar-graph-skeleton';

export default function VolumeStatsDashboard({
  authToken
}: {
  authToken?: string;
}) {
  const { data: volumeStats, loading: volumeStatsLoading } =
    Volume.useGetVolumeStats(authToken);

  return (
    <div className='container mx-auto py-10'>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='text-4xl font-bold'>Volume Dashboard</h1>
        {/* <DatePickerWithRange date={date} setDate={setDate} /> */}
      </div>

      <div className='mb-8 grid grid-cols-1 gap-8 md:grid-cols-2'>
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

      <div className='mb-8 grid grid-cols-1'>
        <Card>
          <CardHeader>
            <CardTitle>Volume by Game</CardTitle>
          </CardHeader>
          <CardContent>
            <GameVolumeChart data={volumeStats?.volumeByGame ?? []} />
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

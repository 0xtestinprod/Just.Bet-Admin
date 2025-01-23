'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { formatCurrency } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { HourlyVolumeChart } from './components/hourly-volume-chart';
import { GameStatsTable } from './components/game-stats-table';
import { GameVolumeChart } from './components/game-volume-chart';

// Mock data
const mockData = {
  totalVolume: 47077319982,
  volumeByGame: [
    {
      game: '1',
      volume: 12988843135,
      transactionCount: 15,
      averageBetSize: 865922875.6666666
    },
    {
      game: '2',
      volume: 12910250172,
      transactionCount: 15,
      averageBetSize: 860683344.8
    },
    {
      game: '3',
      volume: 10373526481,
      transactionCount: 15,
      averageBetSize: 691568432.0666667
    },
    {
      game: '4',
      volume: 10804700194,
      transactionCount: 15,
      averageBetSize: 720313346.2666667
    }
  ]
};

// Mock hourly data
const mockHourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  volume: Math.floor(Math.random() * 1000000000),
  transactionCount: Math.floor(Math.random() * 1000)
}));

export default function VolumeStatsDashboard() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 20),
    to: new Date(2023, 0, 25)
  });

  return (
    <div className='container mx-auto py-10'>
      {/* <div className='mb-8 flex items-center justify-between'>
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
              {formatCurrency(mockData.totalVolume)}
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
            <GameVolumeChart data={mockData.volumeByGame} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Hourly Volume Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <HourlyVolumeChart data={mockHourlyData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Game Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <GameStatsTable data={mockData.volumeByGame} />
        </CardContent>
      </Card> */}
    </div>
  );
}

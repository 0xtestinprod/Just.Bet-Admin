'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';

function formatNumber(
  value: number,
  type: 'currency' | 'decimal' | 'percent'
): string {
  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      }).format(value);
    case 'decimal':
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    case 'percent':
      return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 2
      }).format(value);
  }
}

interface GamePerformanceStats {
  name: string;
  frequency: number;
  averageBetSize: number;
  winRatio: number;
  houseEdge: number;
  revenue: number;
}

const mockData: GamePerformanceStats[] = [
  {
    name: 'Poker',
    frequency: 1000,
    averageBetSize: 50,
    winRatio: 0.48,
    houseEdge: 0.05,
    revenue: 2500
  },
  {
    name: 'Blackjack',
    frequency: 1500,
    averageBetSize: 25,
    winRatio: 0.49,
    houseEdge: 0.01,
    revenue: 3750
  },
  {
    name: 'Roulette',
    frequency: 800,
    averageBetSize: 10,
    winRatio: 0.47,
    houseEdge: 0.0526,
    revenue: 800
  },
  {
    name: 'Slots',
    frequency: 5000,
    averageBetSize: 1,
    winRatio: 0.45,
    houseEdge: 0.1,
    revenue: 5000
  },
  {
    name: 'Baccarat',
    frequency: 600,
    averageBetSize: 100,
    winRatio: 0.49,
    houseEdge: 0.0106,
    revenue: 6000
  }
];

export default function GamePerformanceTable() {
  const [sortColumn, setSortColumn] =
    useState<keyof GamePerformanceStats>('frequency');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedData = [...mockData].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (column: keyof GamePerformanceStats) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ column }: { column: keyof GamePerformanceStats }) => {
    if (column !== sortColumn) return <ArrowUpDown className='ml-2 h-4 w-4' />;
    return sortDirection === 'asc' ? (
      <ChevronUp className='ml-2 h-4 w-4' />
    ) : (
      <ChevronDown className='ml-2 h-4 w-4' />
    );
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Game Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant='ghost' onClick={() => handleSort('name')}>
                  Game <SortIcon column='name' />
                </Button>
              </TableHead>
              <TableHead className='text-right'>
                <Button variant='ghost' onClick={() => handleSort('frequency')}>
                  Frequency <SortIcon column='frequency' />
                </Button>
              </TableHead>
              <TableHead className='text-right'>
                <Button
                  variant='ghost'
                  onClick={() => handleSort('averageBetSize')}
                >
                  Avg Bet Size <SortIcon column='averageBetSize' />
                </Button>
              </TableHead>
              <TableHead className='text-right'>
                <Button variant='ghost' onClick={() => handleSort('winRatio')}>
                  Win Ratio <SortIcon column='winRatio' />
                </Button>
              </TableHead>
              <TableHead className='text-right'>
                <Button variant='ghost' onClick={() => handleSort('houseEdge')}>
                  House Edge <SortIcon column='houseEdge' />
                </Button>
              </TableHead>
              <TableHead className='text-right'>
                <Button variant='ghost' onClick={() => handleSort('revenue')}>
                  Revenue <SortIcon column='revenue' />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((game) => (
              <TableRow key={game.name}>
                <TableCell className='font-medium'>{game.name}</TableCell>
                <TableCell className='text-right'>
                  {formatNumber(game.frequency, 'decimal')}
                </TableCell>
                <TableCell className='text-right'>
                  {formatNumber(game.averageBetSize, 'currency')}
                </TableCell>
                <TableCell className='text-right'>
                  {formatNumber(game.winRatio, 'percent')}
                </TableCell>
                <TableCell className='text-right'>
                  {formatNumber(game.houseEdge, 'percent')}
                </TableCell>
                <TableCell className='text-right'>
                  {formatNumber(game.revenue, 'currency')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

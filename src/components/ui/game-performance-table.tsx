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
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { GamePerformanceStats, TokenPerformance } from 'utils/mockData';

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
      }).format(value / 100);
  }
}

interface GamePerformanceTableProps {
  tokenPerformance: TokenPerformance[];
}

export default function GamePerformanceTable({
  tokenPerformance
}: GamePerformanceTableProps) {
  const [sortColumn, setSortColumn] =
    useState<keyof GamePerformanceStats>('frequency');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const allGameStats = tokenPerformance.flatMap((token) =>
    token.gameStats.map((game) => ({
      ...game,
      tokenName: token.name,
      tokenAddress: token.address
    }))
  );

  const sortedGameStats = allGameStats.sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedGameStats.length / itemsPerPage);
  const paginatedGameStats = sortedGameStats.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Game Performance Across All Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead>Game</TableHead>
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
                <Button variant='ghost' onClick={() => handleSort('revenue')}>
                  Revenue <SortIcon column='revenue' />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedGameStats.map((game, index) => (
              <TableRow key={`${game.tokenAddress}-${game.game.name}-${index}`}>
                <TableCell>{game.tokenName}</TableCell>
                <TableCell>{game.game.name}</TableCell>
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
                  {formatNumber(game.revenue, 'currency')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className='flex items-center justify-between space-x-2 py-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className='h-4 w-4' />
            Previous
          </Button>
          <div className='text-sm text-muted-foreground'>
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

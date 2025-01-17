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
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GamePerformanceStats, TokenPerformance } from '../utils/mockData';

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

interface TokenPerformanceTableProps {
  tokenPerformance: TokenPerformance;
}

export default function TokenPerformanceTable({
  tokenPerformance
}: TokenPerformanceTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(
    tokenPerformance.gameStats.length / itemsPerPage
  );
  const paginatedGameStats = tokenPerformance.gameStats.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>
          Game Performance for {tokenPerformance.name} (
          {tokenPerformance.address})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Game</TableHead>
              <TableHead className='text-right'>Frequency</TableHead>
              <TableHead className='text-right'>Avg Bet Size</TableHead>
              <TableHead className='text-right'>Win Ratio</TableHead>
              <TableHead className='text-right'>Revenue</TableHead>
              <TableHead className='text-right'>Profit</TableHead>
              <TableHead className='text-right'>Profit %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedGameStats.map((game) => (
              <TableRow key={game.game.name}>
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
                <TableCell className='text-right'>
                  {formatNumber(game.profit, 'currency')}
                </TableCell>
                <TableCell className='text-right'>
                  {formatNumber(game.profitPercent, 'percent')}
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

'use client';

import { GamePerformanceResponse } from '@/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUpDown, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GamePerformanceTableProps {
  data: GamePerformanceResponse[];
  isLoading?: boolean;
  error?: Error | null;
}

type SortKey = keyof GamePerformanceResponse;

export function GamePerformanceTable({
  data,
  isLoading,
  error
}: GamePerformanceTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: 'asc' | 'desc';
  }>({
    key: 'game',
    direction: 'asc'
  });

  const itemsPerPage = 10;

  // Sorting logic
  const sortedData = [...(data || [])].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Filtering logic
  const filteredData = sortedData.filter((row) =>
    row.game.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: SortKey) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='text-red-500'>Error Loading Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center space-x-2'>
          <Input
            placeholder='Search games...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='max-w-sm'
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-center'>
                  <Button
                    variant='ghost'
                    onClick={() => handleSort('game')}
                    className='h-8 w-full justify-center px-2 py-0'
                  >
                    Game
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                  </Button>
                </TableHead>
                <TableHead className='text-center'>
                  <Button
                    variant='ghost'
                    onClick={() => handleSort('frequency')}
                    className='h-8 w-full justify-center px-2 py-0'
                  >
                    Frequency
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                  </Button>
                </TableHead>
                <TableHead className='text-center'>
                  <Button
                    variant='ghost'
                    onClick={() => handleSort('winsPercentage')}
                    className='h-8 w-full justify-center px-2 py-0'
                  >
                    Win Rate
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                  </Button>
                </TableHead>
                <TableHead className='text-center'>
                  <Button
                    variant='ghost'
                    onClick={() => handleSort('averageBetSize')}
                    className='h-8 w-full justify-center px-2 py-0'
                  >
                    Avg Bet Size
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                  </Button>
                </TableHead>
                <TableHead className='text-center'>
                  <Button
                    variant='ghost'
                    onClick={() => handleSort('revenue')}
                    className='h-8 w-full justify-center px-2 py-0'
                  >
                    Revenue
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                  </Button>
                </TableHead>
                <TableHead className='text-center'>
                  <Button
                    variant='ghost'
                    onClick={() => handleSort('profit')}
                    className='h-8 w-full justify-center px-2 py-0'
                  >
                    Profit
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                  </Button>
                </TableHead>
                <TableHead className='text-center'>
                  <Button
                    variant='ghost'
                    onClick={() => handleSort('losses')}
                    className='h-8 w-full justify-center px-2 py-0'
                  >
                    Losses
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                  </Button>
                </TableHead>
                <TableHead className='text-center'>
                  <Button
                    variant='ghost'
                    onClick={() => handleSort('profitLossRatio')}
                    className='h-8 w-full justify-center px-2 py-0'
                  >
                    P/L Ratio
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                  </Button>
                </TableHead>
                <TableHead className='text-center'>
                  <Button
                    variant='ghost'
                    onClick={() => handleSort('profitPercent')}
                    className='h-8 w-full justify-center px-2 py-0'
                  >
                    Profit %
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className='py-8 text-center'>
                    <div className='flex items-center justify-center'>
                      <Loader2 className='h-8 w-8 animate-spin' />
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className='py-8 text-center'>
                    No games found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row) => (
                  <TableRow key={row.game}>
                    <TableCell className='text-center font-medium'>
                      {row.game}
                    </TableCell>
                    <TableCell className='text-center'>
                      {row.frequency}
                    </TableCell>
                    <TableCell className='text-center'>
                      {(row.winsPercentage * 100).toFixed(2)}%
                    </TableCell>
                    <TableCell className='text-center'>
                      ${row.averageBetSize.toFixed(2)}
                    </TableCell>
                    <TableCell className='text-center'>
                      ${row.revenue.toFixed(2)}
                    </TableCell>
                    <TableCell className='text-center'>
                      <span
                        className={
                          row.profit >= 0 ? 'text-green-500' : 'text-red-500'
                        }
                      >
                        ${row.profit.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className='text-center'>
                      ${row.losses.toFixed(2)}
                    </TableCell>
                    <TableCell className='text-center'>
                      {row.profitLossRatio.toFixed(2)}
                    </TableCell>
                    <TableCell className='text-center'>
                      <span
                        className={
                          row.profitPercent >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        }
                      >
                        {(row.profitPercent * 100).toFixed(2)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className='flex items-center justify-between space-x-2 py-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className='mr-2 h-4 w-4' />
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
            <ChevronRight className='ml-2 h-4 w-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';

export function GameStatsTable({ data }: { data: any }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = data.filter((game: any) =>
    game.game.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <Input
          placeholder='Search games...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='max-w-sm'
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Game</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead>Transaction Count</TableHead>
            <TableHead>Average Bet Size</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((game: any) => (
            <TableRow key={game.game}>
              <TableCell>{game.game}</TableCell>
              <TableCell>{formatCurrency(game.volume)}</TableCell>
              <TableCell>{game.transactionCount.toLocaleString()}</TableCell>
              <TableCell>{formatCurrency(game.averageBetSize)}</TableCell>
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
    </div>
  );
}

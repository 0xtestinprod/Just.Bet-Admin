'use client';

import { Token } from '@/api';
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
import { useMemo, useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TokenPerformanceTableProps {
  data: Token[];
  isLoading?: boolean;
  error?: Error | null;
}

type SortKey = keyof Token;

const ITEMS_PER_PAGE = 10;

export function TokenPerformanceTable({
  data,
  isLoading,
  error
}: TokenPerformanceTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: 'asc' | 'desc';
  }>({
    key: 'symbol',
    direction: 'asc'
  });

  const sortedData = useMemo(() => {
    if (!data?.length) return [];
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      const sortMultiplier = sortConfig.direction === 'asc' ? 1 : -1;
      return aValue < bValue ? -sortMultiplier : sortMultiplier;
    });
  }, [data, sortConfig]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedData;
    const searchLower = searchTerm.toLowerCase();
    return sortedData.filter(
      (token) =>
        token.symbol.toLowerCase().includes(searchLower) ||
        token.address.toLowerCase().includes(searchLower)
    );
  }, [sortedData, searchTerm]);

  const { paginatedData, totalPages } = useMemo(() => {
    const total = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginated = filteredData.slice(start, start + ITEMS_PER_PAGE);
    return { paginatedData: paginated, totalPages: total };
  }, [filteredData, currentPage]);

  const handleSort = useCallback((key: SortKey) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

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
        <CardTitle>Tokens</CardTitle>
        <div className='flex items-center space-x-2 pt-4'>
          <Input
            placeholder='Search by symbol or address...'
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className='max-w-sm'
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant='ghost'
                    onClick={() => handleSort('address')}
                    className='flex items-center space-x-1'
                  >
                    Address
                    <ArrowUpDown className='h-4 w-4' />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant='ghost'
                    onClick={() => handleSort('symbol')}
                    className='flex items-center space-x-1'
                  >
                    Symbol
                    <ArrowUpDown className='h-4 w-4' />
                  </Button>
                </TableHead>
                <TableHead className='text-right'>
                  <Button
                    variant='ghost'
                    onClick={() => handleSort('decimals')}
                    className='ml-auto flex items-center space-x-1'
                  >
                    Decimals
                    <ArrowUpDown className='h-4 w-4' />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className='py-8 text-center'>
                    <div className='flex items-center justify-center'>
                      <Loader2 className='h-8 w-8 animate-spin' />
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className='py-8 text-center'>
                    No tokens found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((token) => (
                  <TableRow key={token.address}>
                    <TableCell className='font-medium'>
                      {token.address}
                    </TableCell>
                    <TableCell>{token.symbol}</TableCell>
                    <TableCell className='text-right'>
                      {token.decimals}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className='mt-4 flex items-center justify-between'>
          <Button
            variant='outline'
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className='mr-2 h-4 w-4' />
            Previous
          </Button>
          <span className='text-sm text-muted-foreground'>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant='outline'
            onClick={() => handlePageChange(currentPage + 1)}
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

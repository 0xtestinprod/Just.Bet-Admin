'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, ArrowUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as PlayerSegmentation from '@/models/player-segmentation';
import { PlayerSegmentType } from '@/models/player-segmentation';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 10;

function abbreviateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function PlayerSegmentationDashboard({
  authToken
}: {
  authToken?: string;
}) {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [highRollerPercentile, setHighRollerPercentile] = useState(80);
  const [lowRollerPercentile, setLowRollerPercentile] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [refetchQueryInput, setRefetchQueryInput] =
    useState<PlayerSegmentation.PlayerSegmentsInput | null>(null);
  const queryInput = useMemo(
    () => ({
      timeFrom: Math.floor((dateFrom?.getTime() ?? 1725227986) / 1000), // Convert milliseconds to seconds
      timeTo: Math.floor((dateTo?.getTime() ?? Date.now()) / 1000), // Convert milliseconds to seconds
      highRollerMinPercentile: highRollerPercentile,
      lowRollerMaxPercentile: lowRollerPercentile
    }),
    [dateFrom, dateTo, highRollerPercentile, lowRollerPercentile]
  );

  const {
    data: allSegments = [],
    loading: isLoading,
    error,
    refetch
  } = PlayerSegmentation.useGetPlayerSegments(
    queryInput,
    [refetchQueryInput],
    authToken
  );

  const memoizedTotalPages = useMemo(
    () => Math.ceil((allSegments?.length ?? 0) / ITEMS_PER_PAGE),
    [allSegments]
  );

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: '', direction: 'asc' });

  const handleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const currentPageSegments = useMemo(() => {
    const sortedData = [...(allSegments ?? [])].sort((a, b) => {
      if (sortConfig.key === '') return 0;

      const aValue = a[sortConfig.key as keyof typeof a];
      const bValue = b[sortConfig.key as keyof typeof b];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedData.slice(startIndex, endIndex);
  }, [allSegments, currentPage, sortConfig]);

  const segmentCounts = useMemo(
    () =>
      (allSegments ?? []).reduce(
        (acc, segment) => {
          acc[segment.segment] = (acc[segment.segment] || 0) + 1;
          return acc;
        },
        {} as Record<PlayerSegmentType, number>
      ),
    [allSegments]
  );

  const handleApplyFilters = () => {
    setRefetchQueryInput(queryInput);
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = (currentPage: number, totalPages: number) => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i < totalPages && i > 1) {
        range.push(i);
      }
    }

    range.push(totalPages);

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  if (error) {
    throw error;
  }

  return (
    <div>
      <h1 className='mb-4 text-2xl font-bold'>Player Segmentation Dashboard</h1>

      <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='dateFrom'>Date From</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !dateFrom && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {dateFrom ? format(dateFrom, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                selected={dateFrom}
                onSelect={(date: Date | undefined) => {
                  setDateFrom(date ?? new Date());
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='dateTo'>Date To</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !dateTo && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {dateTo ? format(dateTo, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                selected={dateTo}
                onSelect={(date: Date | undefined) => {
                  setDateTo(date ?? new Date());
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='highRollerPercentile'>High Roller Percentile</Label>
          <Input
            id='highRollerPercentile'
            type='number'
            min='0'
            max='100'
            value={highRollerPercentile}
            onChange={(e) => setHighRollerPercentile(Number(e.target.value))}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='lowRollerPercentile'>Low Roller Percentile</Label>
          <Input
            id='lowRollerPercentile'
            type='number'
            min='0'
            max='100'
            value={lowRollerPercentile}
            onChange={(e) => setLowRollerPercentile(Number(e.target.value))}
          />
        </div>
      </div>

      <Button onClick={handleApplyFilters} className='mb-4'>
        Apply Filters
      </Button>

      <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle>High Rollers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>
              {segmentCounts['High Roller'] || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mid Rollers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>
              {segmentCounts['Mid Roller'] || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Low Rollers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>
              {segmentCounts['Low Roller'] || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant='ghost'
                onClick={() => handleSort('player')}
                className='h-8 w-full justify-start px-2 py-0'
              >
                Player
                <ArrowUpDown className='ml-2 h-4 w-4' />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant='ghost'
                onClick={() => handleSort('segment')}
                className='h-8 w-full justify-start px-2 py-0'
              >
                Segment
                <ArrowUpDown className='ml-2 h-4 w-4' />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant='ghost'
                onClick={() => handleSort('avgWager')}
                className='h-8 w-full justify-end px-2 py-0'
              >
                Avg Wager
                <ArrowUpDown className='ml-2 h-4 w-4' />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant='ghost'
                onClick={() => handleSort('totalWagered')}
                className='h-8 w-full justify-end px-2 py-0'
              >
                Total Wagered
                <ArrowUpDown className='ml-2 h-4 w-4' />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant='ghost'
                onClick={() => handleSort('gameCount')}
                className='h-8 w-full justify-end px-2 py-0'
              >
                Game Count
                <ArrowUpDown className='ml-2 h-4 w-4' />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className='text-center'>
                <div className='flex items-center justify-center py-4'>
                  <Loader2 className='h-8 w-8 animate-spin' />
                </div>
              </TableCell>
            </TableRow>
          ) : currentPageSegments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className='py-4 text-center'>
                No data available
              </TableCell>
            </TableRow>
          ) : (
            currentPageSegments.map((segment) => (
              <TableRow key={segment.player}>
                <TableCell className='font-medium'>
                  {abbreviateAddress(segment.player)}
                </TableCell>
                <TableCell>{segment.segment}</TableCell>
                <TableCell className='text-right'>
                  {segment.avgWager.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </TableCell>
                <TableCell className='text-right'>
                  {segment.totalWagered.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </TableCell>
                <TableCell className='text-right'>
                  {segment.gameCount.toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {!isLoading && (
        <Pagination className='mt-4'>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
                isActive={currentPage !== 1}
              />
            </PaginationItem>
            {getPageNumbers(currentPage, memoizedTotalPages).map(
              (pageNum, idx) => (
                <PaginationItem key={idx}>
                  {pageNum === '...' ? (
                    <span className='px-4 py-2'>...</span>
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(pageNum as number)}
                      isActive={currentPage === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  )}
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  currentPage < memoizedTotalPages &&
                  handlePageChange(currentPage + 1)
                }
                isActive={currentPage !== memoizedTotalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

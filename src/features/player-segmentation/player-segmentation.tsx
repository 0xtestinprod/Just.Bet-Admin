'use client';

import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as PlayerSegmentation from '@/models/player-segementation';
import { PlayerSegmentType } from '@/models/player-segementation';

type PlayerSegment = {
  player: string;
  segment: 'High Roller' | 'Mid Roller' | 'Low Roller';
  avgWager: number;
  totalWagered: number;
  gameCount: number;
};

const ITEMS_PER_PAGE = 10; // Define how many items we want per page

export default function PlayerSegmentationDashboard() {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [highRollerPercentile, setHighRollerPercentile] = useState(80);
  const [lowRollerPercentile, setLowRollerPercentile] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [playerSegments, setPlayerSegments] = useState<PlayerSegment[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [refetchQueryInput, setRefetchQueryInput] =
    useState<PlayerSegmentation.PlayerSegmentsInput | null>(null);
  const queryInput = useMemo(
    () => ({
      timeFrom: Math.floor((dateFrom?.getTime() ?? 633026396000) / 1000), // Convert milliseconds to seconds
      timeTo: Math.floor((dateTo?.getTime() ?? 2210863196000) / 1000), // Convert milliseconds to seconds
      highRollerMinPercentile: highRollerPercentile,
      lowRollerMaxPercentile: lowRollerPercentile
    }),
    [dateFrom, dateTo, highRollerPercentile, lowRollerPercentile]
  );

  const {
    data: allSegments = [],
    loading: isLoading,
    refetch
  } = PlayerSegmentation.useGetPlayerSegments(queryInput, [refetchQueryInput]);

  useEffect(() => {
    if (allSegments) {
      // Calculate total pages based on all segments
      setTotalPages(Math.ceil(allSegments.length / ITEMS_PER_PAGE));

      // Get current page segments
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      setPlayerSegments(allSegments.slice(startIndex, endIndex));
    }
  }, [allSegments, currentPage]);

  const handleApplyFilters = () => {
    setRefetchQueryInput(queryInput);
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const segmentCounts = playerSegments.reduce(
    (acc, segment) => {
      acc[segment.segment] = (acc[segment.segment] || 0) + 1;
      return acc;
    },
    {} as Record<PlayerSegmentType, number>
  );

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
                  setDateFrom(date);
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
                  setDateTo(date);
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
            <TableHead>Player</TableHead>
            <TableHead>Segment</TableHead>
            <TableHead>Avg Wager</TableHead>
            <TableHead>Total Wagered</TableHead>
            <TableHead>Game Count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className='text-center'>
                Loading...
              </TableCell>
            </TableRow>
          ) : playerSegments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className='text-center'>
                No data available
              </TableCell>
            </TableRow>
          ) : (
            playerSegments.map((segment) => (
              <TableRow key={segment.player}>
                <TableCell>{segment.player}</TableCell>
                <TableCell>{segment.segment}</TableCell>
                <TableCell>
                  {segment.avgWager.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })}
                </TableCell>
                <TableCell>
                  {segment.totalWagered.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })}
                </TableCell>
                <TableCell>{segment.gameCount}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

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
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => handlePageChange(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                currentPage < totalPages && handlePageChange(currentPage + 1)
              }
              isActive={currentPage !== totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

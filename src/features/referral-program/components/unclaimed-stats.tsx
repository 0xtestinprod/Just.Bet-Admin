'use client';

import { useMemo, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import * as Referral from '@/models/referral';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ArrowUpDown, Search } from 'lucide-react';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

// Chart options
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const
    },
    title: {
      display: true,
      text: 'Distribution by Token'
    }
  }
};

interface TokenData {
  token: string;
  amount: number;
  amountUsd: number;
  count: number;
}

// Helper function to abbreviate token addresses
function abbreviateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Generate random colors for the chart
function generateColors(count: number) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(`hsl(${(i * 360) / count}, 40%, 50%)`);
  }
  return colors;
}

export function UnclaimedStats() {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TokenData;
    direction: 'asc' | 'desc';
  }>({ key: 'amountUsd', direction: 'desc' });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const {
    data: unclaimedData,
    error,
    loading
  } = Referral.useGetUnclaimedReferrals();

  // First filter the data
  const filteredData = useMemo(() => {
    if (!unclaimedData?.unclaimedByToken) return [];
    return unclaimedData.unclaimedByToken.filter((item) =>
      item.token.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [unclaimedData?.unclaimedByToken, searchQuery]);

  // Then sort the filtered data
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      const sortMultiplier = sortConfig.direction === 'asc' ? 1 : -1;
      return aValue > bValue ? sortMultiplier : -sortMultiplier;
    });
  }, [filteredData, sortConfig]);

  // Finally, paginate the sorted data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = useMemo(
    () => Math.ceil(sortedData.length / pageSize),
    [sortedData.length, pageSize]
  );

  // Prepare data for the pie chart
  const chartData = {
    labels: sortedData
      .map((item) => abbreviateAddress(item.token))
      .slice(0, 10),
    datasets: [
      {
        data: sortedData.map((item) => item.amountUsd).slice(0, 10),
        backgroundColor: generateColors(sortedData.length)
      }
    ]
  };

  const requestSort = (key: keyof TokenData) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (error || loading) {
    return null;
  }

  return (
    <div className='space-y-8'>
      {/* Total Unclaimed Card */}
      <Card className='bg-primary/5'>
        <CardHeader>
          <CardTitle>Total Unclaimed Referrals</CardTitle>
          <CardDescription>Total value across all tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-4xl font-bold text-primary'>
            $
            {unclaimedData?.totalUnclaimed.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }) ?? '0.00'}
          </div>
        </CardContent>
      </Card>

      {/* Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Token Distribution</CardTitle>
          <CardDescription>
            Distribution of unclaimed referrals by token
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='h-[400px]'>
            <Pie options={options} data={chartData} />
          </div>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Token Breakdown</CardTitle>
          <CardDescription>
            Comprehensive view of unclaimed referrals by token
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-4 py-4'>
            <div className='relative flex-1'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search by token address...'
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className='pl-8'
              />
            </div>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(1); // Reset to first page when changing page size
              }}
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Select page size' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='5'>5 per page</SelectItem>
                <SelectItem value='10'>10 per page</SelectItem>
                <SelectItem value='20'>20 per page</SelectItem>
                <SelectItem value='50'>50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token Address</TableHead>
                <TableHead>
                  <Button variant='ghost' onClick={() => requestSort('amount')}>
                    Amount
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant='ghost'
                    onClick={() => requestSort('amountUsd')}
                  >
                    Amount (USD)
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant='ghost' onClick={() => requestSort('count')}>
                    Count
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow key={item.token}>
                  <TableCell className='font-mono'>{item.token}</TableCell>
                  <TableCell>
                    {item.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6
                    })}
                  </TableCell>
                  <TableCell>
                    $
                    {item.amountUsd.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </TableCell>
                  <TableCell>{item.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className='flex items-center justify-between space-x-2 py-4'>
            <div className='text-sm text-muted-foreground'>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, sortedData.length)} of{' '}
              {sortedData.length} entries
            </div>
            <div className='flex space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

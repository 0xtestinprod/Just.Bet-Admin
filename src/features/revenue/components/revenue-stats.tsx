'use client';

import { useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import * as Revenue from '@/models/revenue';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { ArrowUpDown, Search } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Chart options
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const
    },
    title: {
      display: true,
      text: 'Revenue by Game'
    }
  }
};

interface GameData {
  game: string;
  revenue: number;
}

export function RevenueStats() {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof GameData;
    direction: 'asc' | 'desc';
  }>({ key: 'revenue', direction: 'desc' });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Fetch revenue data using the API hook
  const { data: revenueData, error, loading } = Revenue.useGetDegenRevenue();

  // Filter and sort data based on search query and current configuration
  const filteredAndSortedData = useMemo(() => {
    if (!revenueData?.byGame) return [];

    return [...revenueData.byGame]
      .filter((item) =>
        item.game.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortConfig.direction === 'asc') {
          return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
        }
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
      });
  }, [revenueData?.byGame, searchQuery, sortConfig]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Prepare data for the chart
  const chartData = {
    labels: filteredAndSortedData.map((item) => item.game),
    datasets: [
      {
        label: 'Revenue',
        data: filteredAndSortedData.map((item) => item.revenue),
        backgroundColor: 'rgba(59, 130, 246, 0.5)'
      }
    ]
  };

  const requestSort = (key: keyof GameData) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (error) {
    throw error;
  }

  return (
    <div className='space-y-8'>
      {/* Revenue Overview Cards */}
      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>Overall revenue across all games</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              ${revenueData?.totalRevenue.toLocaleString() ?? '0'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fee Revenue</CardTitle>
            <CardDescription>Revenue from fees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              ${revenueData?.feeRevenue.toLocaleString() ?? '0'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Loss Revenue</CardTitle>
            <CardDescription>Revenue from losses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              ${revenueData?.lossRevenue.toLocaleString() ?? '0'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Distribution</CardTitle>
          <CardDescription>Revenue breakdown by game</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='h-[400px]'>
            <Bar options={options} data={chartData} />
          </div>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Revenue</CardTitle>
          <CardDescription>Comprehensive revenue data by game</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-4 py-4'>
            <div className='relative flex-1'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search by game name...'
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
                <TableHead>
                  <Button variant='ghost' onClick={() => requestSort('game')}>
                    Game
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant='ghost'
                    onClick={() => requestSort('revenue')}
                  >
                    Revenue
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                  </Button>
                </TableHead>
                <TableHead>% of Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow key={item.game}>
                  <TableCell className='font-medium'>{item.game}</TableCell>
                  <TableCell>${item.revenue.toLocaleString()}</TableCell>
                  <TableCell>
                    {(
                      (item.revenue / (revenueData?.totalRevenue ?? 0)) *
                      100
                    ).toFixed(2)}
                    %
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className='flex items-center justify-between space-x-2 py-4'>
            <div className='text-sm text-muted-foreground'>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredAndSortedData.length)}{' '}
              of {filteredAndSortedData.length} entries
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

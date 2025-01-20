import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import type * as Referral from '@/models/referral';
export function ClaimBreakdownTable({
  breakdown,
  searchTerm,
  setSearchTerm
}: {
  breakdown: Referral.ClaimAnalytics['breakdown'];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Referral.ClaimAnalytics['breakdown'][number] | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  const filteredData = breakdown.filter((item) =>
    item.tokenAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (
    key: keyof Referral.ClaimAnalytics['breakdown'][number]
  ) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc'
    });
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return sortConfig.direction === 'asc'
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const paginatedData = sortedData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Claim Breakdown</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <Input
          placeholder='Search by token address'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='max-w-sm'
        />
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  'Token Address',
                  'Claim Count',
                  'Claimed Amount',
                  'Avg Claim Size',
                  'Claim Percentage'
                ].map((header) => (
                  <TableHead
                    key={header}
                    onClick={() =>
                      handleSort(
                        header
                          .toLowerCase()
                          .replace(
                            /\s+/g,
                            ''
                          ) as keyof Referral.ClaimAnalytics['breakdown'][number]
                      )
                    }
                    className='cursor-pointer hover:bg-gray-100'
                  >
                    {header}{' '}
                    {sortConfig.key ===
                      header.toLowerCase().replace(/\s+/g, '') &&
                      (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className='font-medium'>
                    {item.tokenAddress}
                  </TableCell>
                  <TableCell>{item.claimCount.toLocaleString()}</TableCell>
                  <TableCell>
                    $
                    {item.claimedAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </TableCell>
                  <TableCell>
                    ${item.tokenAverageClaimSize.toFixed(2)}
                  </TableCell>
                  <TableCell>{item.claimPercentage.toFixed(2)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              onClick={() => setPage((page) => Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant='outline'
              onClick={() => setPage((page) => Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
          <div>
            Page {page} of {totalPages}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import React, { useState, useMemo } from 'react';
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
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

interface TokenInfo {
  name: string;
  value: number;
  percentage: number;
  count: number;
  tokenAmount: number;
  tokenAddress: string;
}

interface SortConfig {
  key: keyof TokenInfo;
  direction: 'asc' | 'desc';
}

const TokenInfoTable: React.FC<{ data: TokenInfo[] }> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'value',
    direction: 'desc'
  });

  const filteredData = useMemo(() => {
    return data.filter(
      (token) =>
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.tokenAddress.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    const sortableData = [...filteredData];
    sortableData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sortableData;
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const pageCount = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key: keyof TokenInfo) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'asc'
          ? 'desc'
          : 'asc'
    }));
  };

  const renderSortIcon = (key: keyof TokenInfo) => {
    if (sortConfig.key !== key) return <ChevronsUpDown className='h-4 w-4' />;
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className='h-4 w-4' />
    ) : (
      <ChevronDown className='h-4 w-4' />
    );
  };

  return (
    <div className='mt-8 space-y-4'>
      <h3 className='text-lg font-medium'>Token Details</h3>
      <div className='flex items-center justify-between'>
        <Input
          placeholder='Search tokens...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='max-w-sm'
        />
        <div className='flex items-center space-x-2'>
          <span>Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className='rounded border p-1'
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <span>entries</span>
        </div>
      </div>
      <div className='overflow-x-auto rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              {[
                'Token',
                'Address',
                'Amount',
                'USD Value',
                'Count',
                'Percentage'
              ].map((header) => (
                <TableHead
                  key={header}
                  className='cursor-pointer'
                  onClick={() =>
                    handleSort(
                      header
                        .toLowerCase()
                        .replace(/\s+/g, '') as keyof TokenInfo
                    )
                  }
                >
                  <div className='flex items-center space-x-1'>
                    <span>{header}</span>
                    {renderSortIcon(
                      header
                        .toLowerCase()
                        .replace(/\s+/g, '') as keyof TokenInfo
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((token, index) => (
              <TableRow key={`${token.tokenAddress}-${index}`}>
                <TableCell className='font-medium'>{token.name}</TableCell>
                <TableCell>{`${token.tokenAddress.slice(0, 6)}...${token.tokenAddress.slice(-4)}`}</TableCell>
                <TableCell className='text-right'>
                  {token.tokenAmount.toFixed(2)}
                </TableCell>
                <TableCell className='text-right'>
                  ${token.value.toFixed(2)}
                </TableCell>
                <TableCell className='text-right'>{token.count}</TableCell>
                <TableCell className='text-right'>
                  {token.percentage.toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-between'>
        <div>
          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, sortedData.length)} of{' '}
          {sortedData.length} entries
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, pageCount))
            }
            disabled={currentPage === pageCount}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TokenInfoTable;

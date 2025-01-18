'use client';

import * as React from 'react';

import { Token } from '@/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

export interface TokenSelectorProps {
  tokens: Token[];
  selectedToken: Token | null;
  onSelectToken: (token: Token | null) => void;
  isLoading?: boolean;
}

export function TokenSelector({
  tokens,
  selectedToken,
  onSelectToken,
  isLoading
}: TokenSelectorProps) {
  if (isLoading) {
    return (
      <div className='flex h-10 items-center justify-center rounded-md border border-input bg-background px-3'>
        <Loader2 className='h-4 w-4 animate-spin' />
      </div>
    );
  }

  return (
    <Select
      value={selectedToken?.address}
      onValueChange={(value) => {
        const token = tokens.find((t) => t.address === value);
        onSelectToken(token || null);
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder='Select a token' />
      </SelectTrigger>
      <SelectContent>
        {tokens.map((token) => (
          <SelectItem key={token.address} value={token.address}>
            {token.symbol}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

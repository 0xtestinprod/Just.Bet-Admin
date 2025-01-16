'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ConfirmEmailForm() {
  const [hash, setHash] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    throw new Error('Function not implemented.');
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='hash'>Confirmation Code</Label>
        <Input
          id='hash'
          value={hash}
          onChange={(e) => setHash(e.target.value)}
          required
        />
      </div>
      <Button type='submit'>Confirm Email</Button>
    </form>
  );
}

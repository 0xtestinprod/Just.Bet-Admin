'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    throw new Error('Function not implemented.');
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <Button type='submit'>Send Reset Link</Button>
    </form>
  );
}

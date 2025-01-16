'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ResetPasswordForm({ hash }: { hash: string }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    throw new Error('Function not implemented.');
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='password'>New Password</Label>
        <Input
          id='password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='confirmPassword'>Confirm New Password</Label>
        <Input
          id='confirmPassword'
          type='password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <Button type='submit'>Reset Password</Button>
    </form>
  );
}

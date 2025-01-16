'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/features/auth/services/auth.service';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const hash = searchParams.get('hash');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    if (!hash) {
      toast.error('Invalid reset link');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await authService.resetPassword({
        hash,
        password,
        confirmPassword
      });

      toast.success('Password has been reset successfully');
      router.push('/auth/signin');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
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
          disabled={isLoading}
          minLength={8}
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
          disabled={isLoading}
          minLength={8}
        />
      </div>
      <Button type='submit' className='w-full' disabled={isLoading}>
        {isLoading ? 'Resetting password...' : 'Reset password'}
      </Button>
    </form>
  );
}

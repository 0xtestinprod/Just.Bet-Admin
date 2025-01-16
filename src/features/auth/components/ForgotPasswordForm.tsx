'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/features/auth/services/auth.service';
import { toast } from 'sonner';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
      toast.success('Password reset instructions have been sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className='text-center'>
        <h3 className='text-lg font-medium'>Check your email</h3>
        <p className='mt-2 text-sm text-muted-foreground'>
          We have sent you instructions to reset your password.
        </p>
      </div>
    );
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
          disabled={isLoading}
          placeholder='name@example.com'
        />
      </div>
      <Button type='submit' className='w-full' disabled={isLoading}>
        {isLoading ? 'Sending instructions...' : 'Send reset instructions'}
      </Button>
    </form>
  );
}

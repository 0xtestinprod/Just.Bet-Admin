'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { type ResetPasswordDto, useResetPassword } from '@/models/auth';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hash = searchParams.get('hash');
  const [resetPassword, { loading }] = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ResetPasswordDto>({
    mode: 'onSubmit',
    defaultValues: {
      hash: hash || '',
      password: '',
      confirmPassword: ''
    }
  });

  const password = watch('password');

  const onSubmit = async (data: ResetPasswordDto) => {
    if (!hash) {
      toast.error('Invalid reset link');
      return;
    }

    try {
      await resetPassword(data);
      toast.success('Password has been reset successfully');
      router.push('/auth/signin');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='password'>New Password</Label>
        <Input
          id='password'
          type='password'
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters'
            }
          })}
          disabled={loading}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <p className='text-sm text-red-500'>{errors.password.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='confirmPassword'>Confirm New Password</Label>
        <Input
          id='confirmPassword'
          type='password'
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) =>
              value === password || 'The passwords do not match'
          })}
          disabled={loading}
          aria-invalid={!!errors.confirmPassword}
        />
        {errors.confirmPassword && (
          <p className='text-sm text-red-500'>
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type='submit' className='w-full' disabled={loading}>
        {loading ? 'Resetting password...' : 'Reset password'}
      </Button>
    </form>
  );
}

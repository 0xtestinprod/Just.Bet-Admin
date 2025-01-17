'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { type AuthConfirmEmailDto, useConfirmEmail } from '@/models/auth';

export default function ConfirmEmailForm() {
  const router = useRouter();
  const [confirmEmail, { loading }] = useConfirmEmail();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AuthConfirmEmailDto>({
    mode: 'onSubmit',
    defaultValues: {
      hash: ''
    }
  });

  const onSubmit = async (data: AuthConfirmEmailDto) => {
    try {
      await confirmEmail(data.hash);
      toast.success('Email confirmed successfully');
      router.push('/auth/signin');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='hash'>Confirmation Code</Label>
        <Input
          id='hash'
          {...register('hash', {
            required: 'Confirmation code is required'
          })}
          disabled={loading}
          aria-invalid={!!errors.hash}
        />
        {errors.hash && (
          <p className='text-sm text-red-500'>{errors.hash.message}</p>
        )}
      </div>
      <Button type='submit' className='w-full' disabled={loading}>
        {loading ? 'Confirming...' : 'Confirm Email'}
      </Button>
    </form>
  );
}

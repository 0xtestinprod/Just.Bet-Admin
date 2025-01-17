'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useForgotPassword } from '@/models/auth';
import { useState } from 'react';

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

type FormData = {
  email: string;
};

export default function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [forgotPassword, { loading }] = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    mode: 'onSubmit',
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      await forgotPassword(data.email);
      setIsSubmitted(true);
      toast.success('Password reset instructions have been sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

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
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          type='email'
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: EMAIL_REGEX,
              message: 'Please enter a valid email address'
            }
          })}
          disabled={loading}
          placeholder='name@example.com'
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className='text-sm text-red-500'>{errors.email.message}</p>
        )}
      </div>
      <Button type='submit' className='w-full' disabled={loading}>
        {loading ? 'Sending instructions...' : 'Send reset instructions'}
      </Button>
    </form>
  );
}

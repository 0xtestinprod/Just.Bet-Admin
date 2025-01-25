'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { type LoginDto } from '@/models/auth';

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginDto>({
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginDto) => {
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      });

      if (result?.error) {
        setError(
          'password',
          {
            message: 'Invalid credentials'
          },
          { shouldFocus: true }
        );
        toast.error('Invalid credentials');
        return;
      }

      toast.success('Logged in successfully');
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

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
          placeholder='name@example.com'
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className='text-sm text-red-500'>{errors.email.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='password'>Password</Label>
        <Input
          id='password'
          type='password'
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be between 6 and 20 characters'
            },
            maxLength: {
              value: 20,
              message: 'Password must be between 6 and 20 characters'
            }
          })}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <p className='text-sm text-red-500'>{errors.password.message}</p>
        )}
      </div>

      {/* <div className='text-sm'>
        <Link href='/forgot-password' className='text-primary hover:underline'>
          Forgot password?
        </Link>
      </div> */}

      <Button type='submit' className='w-full'>
        Sign in
      </Button>

      {/* <div className='text-center text-sm'>
        New user?{' '}
        <Link href='/register' className='text-primary hover:underline'>
          Create an account
        </Link>
      </div> */}
    </form>
  );
}

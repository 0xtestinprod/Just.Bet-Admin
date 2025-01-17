/* eslint-disable no-console */
'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { type RegisterDto, useRegister } from '@/models/auth';

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

interface RegisterFormProps {
  onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [register, { loading }] = useRegister();
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch,
    setError
  } = useForm<RegisterDto & { confirmPassword: string }>({
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: ''
    }
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterDto & { confirmPassword: string }) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }

    // Remove confirmPassword before sending to API
    const { confirmPassword, ...registerData } = data;

    try {
      await register(registerData);
      toast.success(
        'Registration successful! Please sign in with your credentials.'
      );
      onSuccess?.();
    } catch (error: any) {
      console.error('Registration error:', {
        message: error.message,
        response: error.response?.data
      });

      // Handle validation errors
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.message;
        if (typeof validationErrors === 'string') {
          toast.error(validationErrors);
        } else if (Array.isArray(validationErrors)) {
          // Set form errors if they match field names
          validationErrors.forEach((errorMsg: string) => {
            const field = errorMsg.toLowerCase();
            if (field.includes('email')) {
              setError('email', { message: errorMsg });
            } else if (field.includes('password')) {
              setError('password', { message: errorMsg });
            } else if (field.includes('firstname')) {
              setError('firstName', { message: errorMsg });
            } else if (field.includes('lastname')) {
              setError('lastName', { message: errorMsg });
            }
          });
          toast.error('Please fix the validation errors');
        }
      } else {
        toast.error(error.response?.data?.message || 'Something went wrong');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          type='email'
          {...registerField('email', {
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

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='firstName'>First Name</Label>
          <Input
            id='firstName'
            {...registerField('firstName', {
              required: 'First name is required'
            })}
            disabled={loading}
            placeholder='John'
            aria-invalid={!!errors.firstName}
          />
          {errors.firstName && (
            <p className='text-sm text-red-500'>{errors.firstName.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='lastName'>Last Name</Label>
          <Input
            id='lastName'
            {...registerField('lastName', {
              required: 'Last name is required'
            })}
            disabled={loading}
            placeholder='Doe'
            aria-invalid={!!errors.lastName}
          />
          {errors.lastName && (
            <p className='text-sm text-red-500'>{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='password'>Password</Label>
        <Input
          id='password'
          type='password'
          {...registerField('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
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
        <Label htmlFor='confirmPassword'>Confirm Password</Label>
        <Input
          id='confirmPassword'
          type='password'
          {...registerField('confirmPassword', {
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
        {loading ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
}

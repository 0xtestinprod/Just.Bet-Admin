'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';
import Link from 'next/link';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import ResetPasswordForm from '../components/ResetPasswordForm';
import ConfirmEmailForm from '../components/ConfirmEmailForm';
import { useState } from 'react';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function SignInViewPage() {
  const [currentForm, setCurrentForm] = useState<
    'login' | 'register' | 'forgotPassword' | 'resetPassword' | 'confirmEmail'
  >('login');

  const renderForm = () => {
    switch (currentForm) {
      case 'login':
        return <LoginForm />;
      case 'register':
        return <RegisterForm onSuccess={() => setCurrentForm('login')} />;
      case 'forgotPassword':
        return <ForgotPasswordForm />;
      case 'resetPassword':
        return <ResetPasswordForm />;
      case 'confirmEmail':
        return <ConfirmEmailForm />;
    }
  };
  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <Link
        href='/examples/authentication'
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 hidden md:right-8 md:top-8'
        )}
      >
        Login
      </Link>
      <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
        <div className='absolute inset-0 bg-zinc-900' />
        <div className='relative z-20 flex items-center text-lg font-medium'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='mr-2 h-6 w-6'
          >
            <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
          </svg>
          Logo
        </div>
        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              &ldquo;This starter template has saved me countless hours of work
              and helped me deliver projects to my clients faster than ever
              before.&rdquo;
            </p>
            <footer className='text-sm'>Random Dude</footer>
          </blockquote>
        </div>
      </div>
      <div className='flex h-full items-center p-4 lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              {currentForm === 'login' && 'Sign in to your account'}
              {currentForm === 'register' && 'Create an account'}
              {currentForm === 'forgotPassword' && 'Forgot Password'}
              {currentForm === 'resetPassword' && 'Reset Password'}
              {currentForm === 'confirmEmail' && 'Confirm Your Email'}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {currentForm === 'login' &&
                'Enter your credentials below to sign in'}
              {currentForm === 'register' &&
                'Enter your email below to create your account'}
              {currentForm === 'forgotPassword' &&
                'Enter your email to receive a password reset link'}
              {currentForm === 'resetPassword' &&
                'Enter your new password below'}
              {currentForm === 'confirmEmail' &&
                'Please check your email for the confirmation link'}
            </p>
          </div>
          {renderForm()}
          <div className='mt-4 space-y-2'>
            {currentForm !== 'login' && (
              <Button variant='link' onClick={() => setCurrentForm('login')}>
                Back to Login
              </Button>
            )}
            {currentForm === 'login' && (
              <>
                <Button
                  variant='link'
                  onClick={() => setCurrentForm('register')}
                >
                  Register
                </Button>
                <Button
                  variant='link'
                  onClick={() => setCurrentForm('forgotPassword')}
                >
                  Forgot Password?
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

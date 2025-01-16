'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { FormEvent, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    throw new Error('Function not implemented.');
  }

  return (
    <>
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
        <div className='space-y-2'>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type='submit'>Login</Button>
      </form>
    </>
  );
}

'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    country: '',
    city: '',
    phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    throw new Error('Function not implemented.');
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          name='email'
          type='email'
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='password'>Password</Label>
        <Input
          id='password'
          name='password'
          type='password'
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='firstName'>First Name</Label>
        <Input
          id='firstName'
          name='firstName'
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='lastName'>Last Name</Label>
        <Input
          id='lastName'
          name='lastName'
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='country'>Country</Label>
        <Input
          id='country'
          name='country'
          value={formData.country}
          onChange={handleChange}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='city'>City</Label>
        <Input
          id='city'
          name='city'
          value={formData.city}
          onChange={handleChange}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='phone'>Phone</Label>
        <Input
          id='phone'
          name='phone'
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <Button type='submit'>Register</Button>
    </form>
  );
}

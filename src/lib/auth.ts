import NextAuth from 'next-auth';
import { authConfig } from './next-auth.config';

export const { auth, signIn, signOut } = NextAuth(authConfig);

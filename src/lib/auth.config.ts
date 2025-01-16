import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authService } from '@/features/auth/services/auth.service';

export const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const user = await authService.login({
            email: credentials?.email as string,
            password: credentials?.password as string
          });
          return user;
        } catch (error) {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userData = user;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user = token.userData;
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  }
} satisfies NextAuthConfig;

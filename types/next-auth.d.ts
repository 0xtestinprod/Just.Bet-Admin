import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role?: string;
      token?: string;
      // Add any other user properties you expect
    } & DefaultSession['user'];
    expires: string;
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    role?: string;
    token?: string;
    // Add any other user properties you expect
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userData: {
      id: string;
      email: string;
      name?: string;
      role?: string;
    };
    token: string;
    refreshToken: string;
    expiresAt: number;
  }
}

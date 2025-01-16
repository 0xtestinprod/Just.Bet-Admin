import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role?: string;
      token?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    role?: string;
    token?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userData: {
      id: string;
      email: string;
      name?: string;
      role?: string;
      token?: string;
    };
  }
}

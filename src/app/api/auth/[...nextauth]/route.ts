import NextAuth from 'next-auth/next';

import { authConfig } from '@/lib/next-auth.config';

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };

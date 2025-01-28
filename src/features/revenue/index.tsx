import { Fragment } from 'react';
import { RevenueStats } from './components/revenue-stats';
import { authConfig } from '@/lib/next-auth.config';
import { getServerSession } from 'next-auth';

export default async function RevenueDashboard() {
  const session = await getServerSession(authConfig);

  return <RevenueStats authToken={session?.user?.token} />;
}

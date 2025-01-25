import { Fragment } from 'react';
import { RevenueStats } from './components/revenue-stats';
import { authConfig } from '@/lib/next-auth.config';
import { getServerSession } from 'next-auth';

export default async function RevenueDashboard() {
  const session = await getServerSession(authConfig);

  return (
    <Fragment>
      <h1 className='text-3xl font-bold tracking-tight'>Revenue Dashboard</h1>
      <h3 className='text-muted-foreground'>
        A overview of degen revenue metrics across all games
      </h3>

      <RevenueStats authToken={session?.user?.token} />
    </Fragment>
  );
}

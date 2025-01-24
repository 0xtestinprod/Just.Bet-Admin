import { Fragment } from 'react';
import { RevenueStats } from './components/revenue-stats';

export default function RevenueDashboard() {
  return (
    <Fragment>
      <h1 className='text-3xl font-bold tracking-tight'>Revenue Dashboard</h1>
      <p className='text-muted-foreground'>
        A comprehensive overview of revenue metrics across all games
      </p>

      <RevenueStats />
    </Fragment>
  );
}

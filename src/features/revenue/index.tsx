import { Fragment } from 'react';
import { RevenueStats } from './components/revenue-stats';

export default function RevenueDashboard() {
  return (
    <Fragment>
      <h1 className='text-3xl font-bold tracking-tight'>Revenue Dashboard</h1>
      <h3 className='text-muted-foreground'>
        A overview of degen revenue metrics across all games
      </h3>

      <RevenueStats />
    </Fragment>
  );
}

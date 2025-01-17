import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function BarStats() {
  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold tracking-tight'>Player Statistics</h1>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Players</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>10,482</div>
            <p className='text-xs text-muted-foreground'>
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>New Players</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>2,350</div>
            <p className='text-xs text-muted-foreground'>
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Active Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>8,234</div>
            <p className='text-xs text-muted-foreground'>
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Player Retention Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>78.5%</div>
            <p className='text-xs text-muted-foreground'>
              +2.4% from last month
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

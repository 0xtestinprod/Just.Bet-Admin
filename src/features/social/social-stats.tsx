import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SocialStats() {
  return (
    <div className='grid gap-4 md:grid-cols-2'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Discord Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>32,549</div>
          <p className='text-xs text-muted-foreground'>+19% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Twitter Followers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>24,765</div>
          <p className='text-xs text-muted-foreground'>+27% from last month</p>
        </CardContent>
      </Card>
    </div>
  );
}

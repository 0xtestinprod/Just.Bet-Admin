import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SocialStats } from '@/features/social/social-stats';

export default async function SocialStatsPage() {
  return (
    <Card className='col-span-3'>
      <CardHeader>
        <CardTitle>Social Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <SocialStats />
      </CardContent>
    </Card>
  );
}

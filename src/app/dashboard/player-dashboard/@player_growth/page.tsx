import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayerGrowth } from '@/features/player-growth.tsx/player-growth';

export default async function BarStats() {
  return (
    <Card className='col-span-4'>
      <CardHeader>
        <CardTitle>Player Growth</CardTitle>
      </CardHeader>
      <CardContent className='pl-2'>
        <PlayerGrowth />
      </CardContent>
    </Card>
  );
}

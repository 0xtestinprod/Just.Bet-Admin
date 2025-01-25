import PlayerSegmentationDashboard from '@/features/player-segmentation';

import { authConfig } from '@/lib/next-auth.config';
import { getServerSession } from 'next-auth';

export default async function Page() {
  const session = await getServerSession(authConfig);

  return <PlayerSegmentationDashboard authToken={session?.user?.token} />;
}

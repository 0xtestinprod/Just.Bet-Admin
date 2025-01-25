import VolumeStatsDashboard from '@/features/volume';

import { authConfig } from '@/lib/next-auth.config';
import { getServerSession } from 'next-auth';

export default async function Page() {
  const session = await getServerSession(authConfig);

  return <VolumeStatsDashboard authToken={session?.user?.token} />;
}

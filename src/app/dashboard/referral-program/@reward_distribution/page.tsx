import RewardsStatisticsDashboard from '@/features/rewards-statistics';
import { authConfig } from '@/lib/next-auth.config';
import { getServerSession } from 'next-auth';

export default async function RewardDistribution() {
  const session = await getServerSession(authConfig);

  return (
    <>
      <RewardsStatisticsDashboard authToken={session?.user?.token} />
    </>
  );
}

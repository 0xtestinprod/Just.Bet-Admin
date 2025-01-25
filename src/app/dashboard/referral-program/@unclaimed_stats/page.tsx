import { UnclaimedStats } from '@/features/referral-program/components/unclaimed-stats';
import { authConfig } from '@/lib/next-auth.config';
import { getServerSession } from 'next-auth';

export default async function RewardDistribution() {
  const session = await getServerSession(authConfig);

  return (
    <>
      <UnclaimedStats authToken={session?.user?.token} />
    </>
  );
}

import React from 'react';
import GamePerformanceDashboard from '@/features/game-perfromance';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/next-auth.config';

export default async function GamePerformancePage() {
  const session = await getServerSession(authConfig);

  return <GamePerformanceDashboard authToken={session?.user?.token} />;
}

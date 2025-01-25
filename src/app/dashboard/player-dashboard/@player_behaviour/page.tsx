import { createServerApiClient } from '@/api/server-api-client';
import PlayerDashboard from '@/features/player-behaviour/player-dashboard';
import { authConfig } from '@/lib/next-auth.config';
import { getServerSession } from 'next-auth';

export default async function BarStats() {
  const apiClient = await createServerApiClient();
  const data = await apiClient.getAllPlayers();
  const session = await getServerSession(authConfig);

  return (
    <PlayerDashboard initialPlayers={data} authToken={session?.user?.token} />
  );
}

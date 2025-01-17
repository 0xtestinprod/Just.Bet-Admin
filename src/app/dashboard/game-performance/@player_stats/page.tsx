import { getAllPlayers } from '@/api';
import PlayerDashboard from '@/features/player-dashboard';

export default async function BarStats() {
  const players = await getAllPlayers();

  return <PlayerDashboard initialPlayers={players} />;
}

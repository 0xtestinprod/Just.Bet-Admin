import { delay } from '@/constants/mock-api';
import PlayerDashboard from '@/features/player-dashboard';

export default async function BarStats() {
  await await delay(1000);

  return <PlayerDashboard />;
}

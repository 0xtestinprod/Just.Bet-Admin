import * as api from '@/api';

export type PlayerBehaviorInput = api.PlayerBehaviorInput;
export type DashboardStatisticsResponse = api.DashboardStatisticsResponse;

export {
  getPlayerBehaviorDashboard,
  useGetPlayerBehaviorDashboard
} from '@/api';

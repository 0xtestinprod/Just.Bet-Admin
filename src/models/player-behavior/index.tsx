import * as API from '@/api';

export type PlayerBehaviorInput = API.PlayerBehaviorInput;
export type DashboardStatisticsResponse = API.DashboardStatisticsResponse;

export {
  getPlayerBehaviorDashboard,
  useGetPlayerBehaviorDashboard
} from '@/api';

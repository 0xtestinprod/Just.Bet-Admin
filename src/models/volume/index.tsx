import * as API from '@/api';

export type GameVolumeStats = API.GameVolumeStats;
export type VolumeStatsResponse = API.VolumeStatsResponse;
export type HourlyVolumeDistribution = API.HourlyVolumeDistribution;

export {
  getVolumeStats,
  getHourlyVolumeDistribution,
  useGetVolumeStats,
  useGetHourlyVolumeDistribution
} from '@/api';

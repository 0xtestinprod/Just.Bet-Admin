/* eslint-disable import/no-anonymous-default-export */
import * as API from '@/api';

export type GamePerformanceResponse = API.GamePerformanceResponse;
export {
  getGamePerformance,
  getGamePerformanceByToken,
  useGetGamePerformance,
  useGetGamePerformanceByToken
} from '@/api';

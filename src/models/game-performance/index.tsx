/* eslint-disable import/no-anonymous-default-export */
import * as API from '@/api';

export type GamePerformanceResponse = API.GamePerformanceResponse;
export {
  getGamePerformance,
  getGamePerformanceByToken,
  useGetGamePerformance
} from '@/api';

export default {
  useGetGamePerformanceByToken: API.useGetGamePerformanceByToken
};

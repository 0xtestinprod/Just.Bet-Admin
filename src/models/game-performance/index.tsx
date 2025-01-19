/* eslint-disable import/no-anonymous-default-export */
import * as API from '@/api';
import React from 'react';

export type GamePerformanceResponse = API.GamePerformanceResponse;
export {
  getGamePerformance,
  getGamePerformanceByToken,
  useGetGamePerformance
} from '@/api';

export function useGetGamePerformanceByToken(
  address: string,
  options?: { skip?: boolean }
) {
  const { skip = false } = options || {};
  const [data, setData] = React.useState<GamePerformanceResponse[] | null>(
    null
  );
  const [loading, setLoading] = React.useState<boolean>(!skip);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (skip) {
      setLoading(false);
      setData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    API.getGamePerformanceByToken(address)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [address, skip]);

  return { data, loading, error };
}

export default {
  useGetGamePerformanceByToken
};

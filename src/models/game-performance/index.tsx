/* eslint-disable import/no-anonymous-default-export */
import * as API from '@/api';
import { GamePerformanceResponse } from '@/api';
import React from 'react';

export async function getAllGames(): Promise<string[]> {
  return API.getAllGames();
}

export async function getGamePerformance(): Promise<GamePerformanceResponse[]> {
  return API.getGamePerformance();
}

export async function getGamePerformanceByToken(
  address: string
): Promise<GamePerformanceResponse[]> {
  return API.getGamePerformanceByToken(address);
}

export function useGetAllGames() {
  return API.useGetAllGames();
}

export function useGetGamePerformance() {
  return API.useGetGamePerformance();
}

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
  getAllGames,
  getGamePerformance,
  getGamePerformanceByToken,
  useGetAllGames,
  useGetGamePerformance,
  useGetGamePerformanceByToken
};

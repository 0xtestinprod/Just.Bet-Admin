/* eslint-disable import/no-anonymous-default-export */
import * as API from '@/api';
import { GamePerformanceResponse } from '@/api';

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

export function useGetGamePerformanceByToken(address: string) {
  return API.useGetGamePerformanceByToken(address);
}

export default {
  getAllGames,
  getGamePerformance,
  getGamePerformanceByToken,
  useGetAllGames,
  useGetGamePerformance,
  useGetGamePerformanceByToken
};

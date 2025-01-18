/* eslint-disable import/no-anonymous-default-export */
import * as API from '@/api';
import { Token } from '@/api';

export type { Token };

export async function getAllTokens(): Promise<Token[]> {
  return API.getAllTokens();
}

export async function getTokenByAddress(address: string): Promise<Token> {
  return API.getTokenByAddress(address);
}

export function useGetAllTokens() {
  return API.useGetAllTokens();
}

export function useGetTokenByAddress(address: string) {
  return API.useGetTokenByAddress(address);
}

export default {
  getAllTokens,
  getTokenByAddress,
  useGetAllTokens,
  useGetTokenByAddress
};

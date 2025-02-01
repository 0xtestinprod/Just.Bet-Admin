/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { AxiosInstance } from 'axios';
import React from 'react';
import { axiosInstance } from '@/lib/axios';
import { createServerApiClient } from './server-api-client';
import { useAuthenticatedApiClient } from './clientside-api-client';

//#region Utils
type UseQueryHookResult<ResultT> = {
  data: ResultT | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
};

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export function useQuery<ResultT>(
  fn: () => Promise<ResultT>,
  dependencies: any[] = []
): UseQueryHookResult<ResultT> {
  const [data, setData] = React.useState<ResultT | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<Error | null>(null);

  const fetchData = React.useCallback(() => {
    setLoading(true);
    setError(null);

    fn()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, dependencies);

  React.useEffect(() => fetchData(), [fetchData]);

  const refetch = React.useCallback(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

type UseMutationHookResult<InputT, ResultT> = [
  (input: InputT) => Promise<ResultT | any>,
  { data: ResultT | null; loading: boolean; error: Error | null }
];

export function useMutation<InputT, ResultT>(
  fn: (input: InputT) => Promise<ResultT>
): UseMutationHookResult<InputT, ResultT> {
  const [data, setData] = React.useState<ResultT | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error | null>(null);

  const execute = async (input: InputT): Promise<ResultT | any> => {
    try {
      setLoading(true);
      setError(null);

      const data = await fn(input);

      setData(data);

      return data;
    } catch (error) {
      setError(error as any);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return [execute, { data, loading, error }];
}

//#endregion

//#region Types
//#region Games Entities

export interface GameCollection {
  id: string;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
  game: string;
  wager: number;
  payout: number;
  token_price: number;
  player: string;
  time: number;
  unique_id: string;
  game_id: number | null;
  token: string;
  hash: string;
}

export interface GameResult {
  id: string;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
  game: string;
  wager: number;
  wager_in_dollar: number;
  played_game_count: number;
  multiplier: number;
  profit: number;
  profit_in_dollar: number;
  payout: number;
  payout_in_dollar: number;
  loss: number;
  loss_in_dollar: number;
  fee_amount: number;
  won: boolean;
  player: string;
  time: number;
  unique_id: string;
  game_id: number | null;
  token: string;
  amount_out: number;
  username: string | null;
  hash: string;
}

export interface Token {
  address: string;
  symbol: string;
  decimals: number;
}

//#endregion

//#region Referral Program Entities
export interface ClaimReferral {
  id: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: Date | null;
  bankroll: string;
  token: string;
  recipient: string;
  payin: number;
  payout: number;
  uniqueId: string;
}

export interface RewardReferral {
  id: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: Date | null;
  bankroll: string;
  client: string;
  code: string;
  owner: string;
  rewardToken: number;
  rewardUsd: number;
  volume: number;
  tokenAddress: string;
  uniqueId: string;
}

//TODO: Add Input/Output for unclaimed stats for referral program
//#endregion

// #region Input/Output Player-Behavior Dashboard Types

// Player Behavior Input
export interface PlayerBehaviorInput {
  address: string;
  timeFrom?: number;
  timeTo?: number;
}

// Complete Dashboard Response
export interface DashboardOverviewDto {
  totalGamesPlayed: number;
  uniqueTokensUsed: number;
  lifetimeValue: number;
}

export interface BettingMetricsDto {
  averageBetAmount: number;
  averageBetAmountUsd: number;
  amountBetPerPlayer: number;
  averageBetPerPlayer: number;
  averageBetPerGame: number;
  winLossRatioGame: number;
}

export interface FinancialMetricsDto {
  totalDeposits: number;
  totalDepositsUsd: number;
  largeDeposits: number;
  totalWithdraws: number;
  totalWithdrawsUsd: number;
  largeWithdraws: number;
}

export interface SessionMetricsDto {
  averageSessionDuration: number;
  totalSessions: number;
  averageBettingStreak: number;
}

export interface TokenBreakdownDto {
  tokenSymbol: string;
  deposits: number;
  depositsUsd: number;
  withdrawals: number;
  withdrawalsUsd: number;
  transactionCount: number;
  percentage: number;
}

export interface DashboardStatisticsResponse {
  overview: DashboardOverviewDto;
  betting: BettingMetricsDto;
  financial: FinancialMetricsDto;
  session: SessionMetricsDto;
  tokenBreakdowns?: TokenBreakdownDto[];
}

//#endregion

//#region Auth Input/Output
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ResetPasswordDto {
  hash: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResetPasswordDto {
  password: string;
  confirmPassword: string;
}

export interface AuthConfirmEmailDto {
  hash: string;
}

export interface AuthForgotPasswordDto {
  email: string;
}

export interface LoginResponseType {
  token: string;
  user: any; // Replace with your User type
}

//#endregion

//#region Game Performance Input/Output
export interface GamePerformanceResponse {
  winRatio: number;
  frequency: number;
  winsPercentage: number;
  averageBetSize: number;
  revenue: number;
  profit: number;
  losses: number;
  profitLossRatio: number;
  profitPercent: number;
  game: string;
}

//#endregion

//#region Referral Program Input/Output
export interface TopReferrer {
  address: string;
  referralCount: number;
  volume: number;
}

export interface ReferralStatisticsResponse {
  totalRewards: number;
  topReferrer: TopReferrer;
  averageSpend: number;
}
//#endregion

//#region Rewards Input/Output
export interface RewardBreakdown {
  token: string;
  tokenAmount: number;
  usdValue: number;
  count: number;
  percentage: number;
}

export interface RewardPercentageStats {
  averagePercentage: number;
  minPercentage: number;
  maxPercentage: number;
  medianPercentage: number;
}

export interface OverallRewards {
  totalAvailable: number;
  totalClaimed: number;
  rewardPercentage: number;
}

export interface RewardsAnalytics {
  totalPendingRewards: number;
  rewardBreakdown: RewardBreakdown[];
  rewardPercentageStats: RewardPercentageStats;
  overallRewards: OverallRewards;
}

export interface ClaimOverall {
  totalClaimPercentage: number;
  averageClaimSize: number;
}

export interface ClaimBreakdown {
  tokenAddress: string;
  claimCount: number;
  claimedAmount: number;
  tokenAverageClaimSize: number;
  claimPercentage: number;
}

export interface ClaimAnalytics {
  overall: ClaimOverall;
  breakdown: ClaimBreakdown[];
}
//#endregion

//#region Player Segmentation Input/Output
export interface PlayerSegmentsInput {
  timeFrom: number;
  timeTo: number;
  highRollerMinPercentile: number;
  lowRollerMaxPercentile: number;
}

export interface PlayerSegmentOutput {
  player: string;
  segment: PlayerSegmentType;
  avgWager: number;
  totalWagered: number;
  gameCount: number;
}

export type PlayerSegmentType = 'High Roller' | 'Mid Roller' | 'Low Roller';
//#endregion

//#region Volume Input/Output

export interface GameVolumeStats {
  game: string;
  volume: number;
  transactionCount: number;
  averageBetSize: number;
}

export interface VolumeStatsResponse {
  totalVolume: number;
  volumeByGame: GameVolumeStats[];
}

export interface HourlyVolumeDistribution {
  hour: number;
  volume: number;
  transactionCount: number;
}
//#endregion

//#region degen-revenue Input/Output
export interface DegenRevenueResponse {
  feeRevenue: number;
  lossRevenue: number;
  totalRevenue: number;
  byGame?: {
    game: string;
    revenue: number;
  }[];
}

export interface UnclaimedReferralResponse {
  totalUnclaimed: number;
  unclaimedByToken: {
    token: string;
    amount: number;
    amountUsd: number;
    count: number;
  }[];
}
//#endregion

//#endregion

//#region Api Client
export class ApiClient {
  private basePath: string;
  private headers: any;
  private client: AxiosInstance;

  constructor(basePath = '/api', token?: string) {
    const base_url = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
    this.basePath = `${base_url}${basePath}`;

    this.client = axiosInstance;

    if (token) {
      this.setAuthToken(token);
    }
  }

  setAuthToken(token: string) {
    this.headers = {
      ...this.headers,
      Authorization: `Bearer ${token}`
    };
  }

  setBasePath(basePath: string) {
    this.basePath = basePath;
  }

  getBasePath() {
    if (!this.basePath) throw new Error('ApiClient is not configured');
    return this.basePath;
  }

  setHeaders(headers: any) {
    this.headers = headers;
  }

  getHeaders() {
    return this.headers || {};
  }

  protected async post<T>(path: string, data: any): Promise<ApiResponse<T>> {
    const response = await this.client.post(path, data, {
      headers: {
        ...this.getHeaders()
      }
    });
    return response.data;
  }

  protected async get<T>(path: string, params?: any): Promise<ApiResponse<T>> {
    const response = await this.client.get(path, {
      params,
      headers: {
        ...this.getHeaders()
      }
    });
    return response.data;
  }

  protected async delete<T>(path: string): Promise<ApiResponse<T>> {
    const response = await this.client.delete(path, {
      headers: {
        ...this.getHeaders()
      }
    });
    return response.data;
  }

  //#region Player Behavior Dashboard endpoints
  async getPlayerBehaviorDashboard(
    input: PlayerBehaviorInput,
    token?: string
  ): Promise<DashboardStatisticsResponse> {
    try {
      const response = await this.client.get(
        `player-behavior/stats/player/${input.address}`,
        {
          params: {
            timeFrom: input.timeFrom,
            timeTo: input.timeTo
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      return response.data.data;
    } catch (error: any) {
      console.error('API Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }
  //#endregion

  //#region Game Performance endpoints
  async getGamePerformance(token?: string): Promise<GamePerformanceResponse[]> {
    const response = await this.client.get('games/stats/performance', {
      headers: {
        ...this.getHeaders(),
        Authorization: token
          ? `Bearer ${token}`
          : this.getHeaders().Authorization
      }
    });
    if (response.data.data) {
      return response.data.data;
    }
    return [];
  }

  async getGamePerformanceByToken(
    address: string | null,
    token?: string
  ): Promise<GamePerformanceResponse[]> {
    const response = await this.client.get(
      `games/stats/performance/token/${address}`,
      {
        headers: {
          ...this.getHeaders(),
          Authorization: token
            ? `Bearer ${token}`
            : this.getHeaders().Authorization
        }
      }
    );
    return response.data.data;
  }
  //#endregion

  //#region Auth endpoints
  async login(data: LoginDto): Promise<LoginResponseType> {
    try {
      const response = await this.post<LoginResponseType>(
        'auth/email/login',
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async register(data: RegisterDto): Promise<void> {
    try {
      await this.post('auth/email/register', data);
    } catch (error: any) {
      throw error;
    }
  }

  async confirmEmail(hash: string): Promise<void> {
    try {
      await this.post('auth/email/confirm', { hash });
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await this.post('auth/forgot/password', { email });
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(data: ResetPasswordDto): Promise<void> {
    try {
      await this.post('auth/reset/password', data);
    } catch (error) {
      throw error;
    }
  }

  async resetAuthUserPassword(data: AuthResetPasswordDto): Promise<void> {
    try {
      await this.post('auth/reset/user/password', data);
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    await this.post('auth/logout', {});
  }

  async deleteAccount(): Promise<void> {
    await this.delete('auth/me');
  }
  //#endregion

  // #region Player endpoints
  async getAllPlayers(): Promise<string[]> {
    try {
      const response = await this.get<string[]>('games/players');
      return response.data;
    } catch (error: any) {
      console.error('API Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }
  //#endregion

  //#region Game endpoints
  async getAllGames(token?: string): Promise<string[]> {
    const response = await this.client.get('games/all', {
      headers: {
        ...this.getHeaders(),
        Authorization: token
          ? `Bearer ${token}`
          : this.getHeaders().Authorization
      }
    });
    return response.data;
  }
  //#endregion

  //#region Token endpoints
  async getAllTokens(token?: string): Promise<Token[]> {
    const response = await this.client.get('token/all', {
      headers: {
        ...this.getHeaders(),
        Authorization: token
          ? `Bearer ${token}`
          : this.getHeaders().Authorization
      }
    });
    return response.data.data;
  }

  async getTokenByAddress(address: string, token?: string): Promise<Token> {
    const response = await this.client.get(`token/${address}`, {
      headers: {
        ...this.getHeaders(),
        Authorization: token
          ? `Bearer ${token}`
          : this.getHeaders().Authorization
      }
    });
    return response.data.data;
  }
  //#endregion

  //#region Referral Program endpoints
  async getReferralStatistics(
    token?: string
  ): Promise<ReferralStatisticsResponse> {
    const response = await this.client.get('referrals/statistics', {
      headers: {
        ...this.getHeaders(),
        Authorization: token
          ? `Bearer ${token}`
          : this.getHeaders().Authorization
      }
    });

    return response.data.data;
  }
  //#endregion

  //#region Rewards Program endpoints
  async getRewardsAnalytics(token?: string): Promise<RewardsAnalytics> {
    const response = await this.client.get('referrals/rewards/analytics', {
      headers: {
        ...this.getHeaders(),
        Authorization: token
          ? `Bearer ${token}`
          : this.getHeaders().Authorization
      }
    });
    return response.data.data;
  }

  async getClaimAnalytics(token?: string): Promise<ClaimAnalytics> {
    const response = await this.client.get('referrals/rewards/claims', {
      headers: {
        ...this.getHeaders(),
        Authorization: token
          ? `Bearer ${token}`
          : this.getHeaders().Authorization
      }
    });
    return response.data.data;
  }

  async getUnclaimedReferrals(
    token?: string
  ): Promise<UnclaimedReferralResponse> {
    const response = await this.client.get(
      'additional-stats/unclaimed-referrals',
      {
        headers: {
          ...this.getHeaders(),
          Authorization: token
            ? `Bearer ${token}`
            : this.getHeaders().Authorization
        }
      }
    );
    return response.data.data;
  }
  //#endregion

  //#region Player Segmentation endpoints
  async getPlayerSegments(
    params: PlayerSegmentsInput,
    token?: string
  ): Promise<PlayerSegmentOutput[]> {
    const response = await this.client.get('player-segmentation/segments', {
      params,
      headers: {
        ...this.getHeaders(),
        Authorization: token
          ? `Bearer ${token}`
          : this.getHeaders().Authorization
      }
    });
    return response.data.data;
  }
  //#endregion

  //#region Volume endpoints
  async getVolumeStats(token?: string): Promise<VolumeStatsResponse> {
    const response = await this.client.get('volume-stats', {
      headers: {
        ...this.getHeaders(),
        Authorization: token
          ? `Bearer ${token}`
          : this.getHeaders().Authorization
      }
    });
    return response.data.data;
  }

  async getHourlyVolumeDistribution(
    token?: string
  ): Promise<HourlyVolumeDistribution[]> {
    const response = await this.client.get('volume-stats/hourly-distribution', {
      headers: {
        ...this.getHeaders(),
        Authorization: token
          ? `Bearer ${token}`
          : this.getHeaders().Authorization
      }
    });
    return response.data.data;
  }
  //#endregion

  //#region degen-revenue endpoints
  async getDegenRevenue(
    timeFrom?: number,
    timeTo?: number,
    token?: string
  ): Promise<DegenRevenueResponse> {
    const response = await this.client.get('additional-stats/degen-revenue', {
      params: { timeFrom, timeTo },
      headers: {
        ...this.getHeaders(),
        Authorization: token
          ? `Bearer ${token}`
          : this.getHeaders().Authorization
      }
    });
    return response.data.data;
  }
  //#endregion
}

const defaultApiClient = new ApiClient();

//#endregion

//#region API Functions
// #region Player Behavior Dashboard API Functions
export async function getPlayerBehaviorDashboard(
  input: PlayerBehaviorInput
): Promise<DashboardStatisticsResponse> {
  const apiClient = await createServerApiClient();
  return apiClient.getPlayerBehaviorDashboard(input);
}
//#endregion

// #region Player Behavior Dashboard Hooks
export function useGetPlayerBehaviorDashboard(
  input: PlayerBehaviorInput,
  dependencies: any[] = [],
  token?: string
): UseQueryHookResult<DashboardStatisticsResponse> {
  const apiClient = useAuthenticatedApiClient();
  return useQuery(
    () => apiClient.getPlayerBehaviorDashboard(input, token),
    dependencies
  );
}
//#endregion

// #region Auth API Functions
export async function login(data: LoginDto): Promise<LoginResponseType> {
  return defaultApiClient.login(data);
}

export async function register(data: RegisterDto): Promise<void> {
  return defaultApiClient.register(data);
}

export async function confirmEmail(hash: string): Promise<void> {
  return defaultApiClient.confirmEmail(hash);
}

export async function forgotPassword(email: string): Promise<void> {
  return defaultApiClient.forgotPassword(email);
}

export async function resetPassword(data: ResetPasswordDto): Promise<void> {
  return defaultApiClient.resetPassword(data);
}

export async function resetAuthUserPassword(
  data: AuthResetPasswordDto
): Promise<void> {
  return defaultApiClient.resetAuthUserPassword(data);
}

export async function logout(): Promise<void> {
  return defaultApiClient.logout();
}

export async function deleteAccount(): Promise<void> {
  return defaultApiClient.deleteAccount();
}
//#endregion

// #region Auth Hooks
export function useLogin(): UseMutationHookResult<LoginDto, LoginResponseType> {
  return useMutation((data) => defaultApiClient.login(data));
}

export function useRegister(): UseMutationHookResult<RegisterDto, void> {
  return useMutation((data) => defaultApiClient.register(data));
}

export function useConfirmEmail(): UseMutationHookResult<string, void> {
  return useMutation((hash) => defaultApiClient.confirmEmail(hash));
}

export function useForgotPassword(): UseMutationHookResult<string, void> {
  return useMutation((email) => defaultApiClient.forgotPassword(email));
}

export function useResetPassword(): UseMutationHookResult<
  ResetPasswordDto,
  void
> {
  return useMutation((data) => defaultApiClient.resetPassword(data));
}

export function useResetAuthUserPassword(): UseMutationHookResult<
  AuthResetPasswordDto,
  void
> {
  return useMutation((data) => defaultApiClient.resetAuthUserPassword(data));
}

export function useLogout(): UseMutationHookResult<void, void> {
  return useMutation(() => defaultApiClient.logout());
}

export function useDeleteAccount(): UseMutationHookResult<void, void> {
  return useMutation(() => defaultApiClient.deleteAccount());
}
//#endregion

// #region Player API Functions
export async function getAllPlayers(): Promise<string[]> {
  return defaultApiClient.getAllPlayers();
}
//#endregion

// #region Player Hooks
export function useGetAllPlayers(): UseQueryHookResult<string[]> {
  const apiClient = useAuthenticatedApiClient();
  return useQuery(() => apiClient.getAllPlayers());
}
//#endregion

//#region Game API Functions
export async function getAllGames(token?: string): Promise<string[]> {
  const apiClient = await createServerApiClient();
  return apiClient.getAllGames(token);
}
//#endregion

//#region Game Hooks
export function useGetAllGames(token?: string): UseQueryHookResult<string[]> {
  const apiClient = useAuthenticatedApiClient();
  return useQuery(() => apiClient.getAllGames(token));
}
//#endregion

//#region Game Performance API Functions
export async function getGamePerformance(
  token?: string
): Promise<GamePerformanceResponse[]> {
  const apiClient = await createServerApiClient();
  return apiClient.getGamePerformance(token);
}

export async function getGamePerformanceByToken(
  address: string,
  token?: string
): Promise<GamePerformanceResponse[]> {
  const apiClient = await createServerApiClient();
  return apiClient.getGamePerformanceByToken(address, token);
}
//#endregion

//#region Game Performance Hooks
export function useGetGamePerformance(
  token?: string
): UseQueryHookResult<GamePerformanceResponse[]> {
  const apiClient = useAuthenticatedApiClient();
  return useQuery(() => apiClient.getGamePerformance(token));
}

export function useGetGamePerformanceByToken(
  address: string,
  token?: string,
  deps: any[] = []
): UseQueryHookResult<GamePerformanceResponse[]> {
  const apiClient = useAuthenticatedApiClient();
  return useQuery(() => {
    if (!address) return Promise.resolve([]);
    return apiClient.getGamePerformanceByToken(address, token);
  }, deps);
}
//#endregion

//#region Token API Functions
export async function getAllTokens(token?: string): Promise<Token[]> {
  const apiClient = await createServerApiClient();
  return apiClient.getAllTokens(token);
}

export async function getTokenByAddress(
  address: string,
  token?: string
): Promise<Token> {
  const apiClient = await createServerApiClient();
  return apiClient.getTokenByAddress(address, token);
}
//#endregion

//#region Token Hooks
export function useGetAllTokens(token?: string): UseQueryHookResult<Token[]> {
  const apiClient = useAuthenticatedApiClient();
  return useQuery(() => apiClient.getAllTokens(token));
}

export function useGetTokenByAddress(
  address: string,
  token?: string
): UseQueryHookResult<Token> {
  const apiClient = useAuthenticatedApiClient();
  return useQuery(() => apiClient.getTokenByAddress(address, token));
}
//#endregion

//#region Referral Program API Functions
export async function getReferralStatistics(
  token?: string
): Promise<ReferralStatisticsResponse> {
  const apiClient = await createServerApiClient();
  return apiClient.getReferralStatistics(token);
}
//#endregion

//#region Referral Program Hooks
export function useGetReferralStatistics(
  token?: string
): UseQueryHookResult<ReferralStatisticsResponse> {
  const apiClient = useAuthenticatedApiClient();
  return useQuery(() => apiClient.getReferralStatistics(token));
}
//#endregion

//#region Rewards Program API Functions
export async function getRewardsAnalytics(
  token?: string
): Promise<RewardsAnalytics> {
  const apiClient = await createServerApiClient();
  return apiClient.getRewardsAnalytics(token);
}

export async function getClaimAnalytics(
  token?: string
): Promise<ClaimAnalytics> {
  const apiClient = await createServerApiClient();
  return apiClient.getClaimAnalytics(token);
}

export async function getUnclaimedReferrals(
  token?: string
): Promise<UnclaimedReferralResponse> {
  const apiClient = await createServerApiClient();
  return apiClient.getUnclaimedReferrals(token);
}
//#endregion

//#region Rewards Program Hooks
export function useGetRewardsAnalytics(
  token?: string
): UseQueryHookResult<RewardsAnalytics> {
  const apiClient = useAuthenticatedApiClient();
  return useQuery(() => apiClient.getRewardsAnalytics(token));
}

export function useGetClaimAnalytics(
  token?: string
): UseQueryHookResult<ClaimAnalytics> {
  const apiClient = useAuthenticatedApiClient();
  return useQuery(() => apiClient.getClaimAnalytics(token));
}

export function useGetUnclaimedReferrals(
  token?: string
): UseQueryHookResult<UnclaimedReferralResponse> {
  const apiClient = useAuthenticatedApiClient();
  return useQuery(() => apiClient.getUnclaimedReferrals(token));
}
//#endregion

//#region Player Segmentation API Functions
export async function getPlayerSegments(
  params: PlayerSegmentsInput,
  token?: string
): Promise<PlayerSegmentOutput[]> {
  const apiClient = await createServerApiClient();
  return apiClient.getPlayerSegments(params, token);
}
//#endregion

//#region Player Segmentation Hooks
export function useGetPlayerSegments(
  params: PlayerSegmentsInput,
  dependencies: any[] = [],
  token?: string
): UseQueryHookResult<PlayerSegmentOutput[]> {
  const apiClient = useAuthenticatedApiClient();
  return useQuery(
    () => apiClient.getPlayerSegments(params, token),
    dependencies
  );
}
//#endregion

//#region Volume API Functions
export async function getVolumeStats(
  timeFrom?: number,
  timeTo?: number,
  token?: string
): Promise<VolumeStatsResponse> {
  const apiClient = await createServerApiClient();
  return apiClient.getVolumeStats(token);
}

export async function getHourlyVolumeDistribution(
  timeFrom?: number,
  timeTo?: number,
  token?: string
): Promise<HourlyVolumeDistribution[]> {
  const apiClient = await createServerApiClient();
  return apiClient.getHourlyVolumeDistribution(token);
}
//#endregion

//#region Volume Hooks
export function useGetVolumeStats(
  token?: string
): UseQueryHookResult<VolumeStatsResponse> {
  const apiClient = useAuthenticatedApiClient();
  return useQuery(() => apiClient.getVolumeStats(token));
}

export function useGetHourlyVolumeDistribution(
  timeFrom?: number,
  timeTo?: number,
  token?: string
): UseQueryHookResult<HourlyVolumeDistribution[]> {
  const apiClient = useAuthenticatedApiClient();
  return useQuery(() => apiClient.getHourlyVolumeDistribution(token));
}
//#endregion

//#region degen-revenue API Functions
export async function getDegenRevenue(
  timeFrom?: number,
  timeTo?: number,
  token?: string
): Promise<DegenRevenueResponse> {
  const apiClient = await createServerApiClient();
  return apiClient.getDegenRevenue(timeFrom, timeTo, token);
}
//#endregion

//#region degen-revenue Hooks
export function useGetDegenRevenue(
  timeFrom?: number,
  timeTo?: number,
  token?: string
): UseQueryHookResult<DegenRevenueResponse> {
  const apiClient = useAuthenticatedApiClient();
  return useQuery(() => apiClient.getDegenRevenue(timeFrom, timeTo, token));
}
//#endregion

//#endregion

export default {
  default: defaultApiClient,
  getPlayerBehaviorDashboard,
  useGetPlayerBehaviorDashboard,
  login,
  register,
  confirmEmail,
  forgotPassword,
  resetPassword,
  resetAuthUserPassword,
  logout,
  deleteAccount,
  useLogin,
  useRegister,
  useConfirmEmail,
  useForgotPassword,
  useResetPassword,
  useResetAuthUserPassword,
  useLogout,
  useDeleteAccount,
  getAllPlayers,
  useGetAllPlayers,
  getAllGames,
  getGamePerformance,
  getGamePerformanceByToken,
  useGetAllGames,
  useGetGamePerformance,
  useGetGamePerformanceByToken,
  getAllTokens,
  getTokenByAddress,
  useGetAllTokens,
  useGetTokenByAddress,
  getReferralStatistics,
  getRewardsAnalytics,
  getClaimAnalytics,
  useGetRewardsAnalytics,
  useGetClaimAnalytics,
  getPlayerSegments,
  useGetPlayerSegments,
  getVolumeStats,
  getHourlyVolumeDistribution,
  useGetVolumeStats,
  useGetHourlyVolumeDistribution,
  getDegenRevenue,
  getUnclaimedReferrals,
  useGetDegenRevenue,
  useGetUnclaimedReferrals
};

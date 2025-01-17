/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import axios, { AxiosInstance } from 'axios';
import React from 'react';

//#region utils
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
  fn: () => Promise<ResultT>
): UseQueryHookResult<ResultT> {
  const [data, setData] = React.useState<ResultT | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<Error | null>(null);

  const fetchData = React.useCallback(() => {
    setError(null);

    fn()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => fetchData(), []);

  const refetch = React.useCallback(() => {
    setLoading(true);
    fetchData();
  }, []);

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

//#region Games Types

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

//#endregion

// # Input/Output Player-Behavior Dashboard Types

// Token Transaction
interface TokenTransaction {
  token: string;
  amount: number;
  amountUsd: number;
  timestamp: number;
}

// Dashboard Overview Section
interface DashboardOverview {
  totalGamesPlayed: number;
  uniqueTokensUsed: number;
  winLossRatio: number;
  currentStreak: number;
  lifetimeValue: number;
}

// Betting Metrics Section
interface BettingMetrics {
  averageBetAmount: number;
  averageBetAmountUsd: number;
  betPerGame: number;
  maxWinStreak: number;
  maxLoseStreak: number;
}

// Financial Metrics Section
interface FinancialMetrics {
  deposits: TokenTransaction[];
  withdrawals: TokenTransaction[];
  largeDeposits: TokenTransaction[];
  largeWithdrawals: TokenTransaction[];
}

// Session Metrics Section
interface SessionMetrics {
  averageSessionDuration: number;
  totalSessions: number;
  totalPlayTime: number;
  averageBettingStreak: number;
}

// Player Behavior Input
export interface PlayerBehaviorInput {
  address: string;
  timeFrom?: number;
  timeTo?: number;
}

// Complete Dashboard Response
export interface DashboardStatisticsResponse {
  overview: DashboardOverview;
  betting: BettingMetrics;
  financial: FinancialMetrics;
  session: SessionMetrics;
}

//#endregion

//#region Auth Types
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  country?: string;
  city?: string;
  phone?: string;
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

//#region Api Client
export class ApiClient {
  private basePath: string;
  private headers: any;
  private client: AxiosInstance;

  constructor(basePath = '/api') {
    const base_url = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
    this.basePath = `${base_url}${basePath}`;

    console.log(this.basePath, 'basePath');

    this.client = axios.create({
      baseURL: this.basePath,
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      }
    });
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

  // #region Auth endpoints

  //#region Player Behavior Dashboard endpoints
  async getPlayerBehaviorDashboard(
    input: PlayerBehaviorInput
  ): Promise<DashboardStatisticsResponse> {
    try {
      const response = await this.client.get(
        `games/stats/player/${input.address}`,
        {
          params: {
            timeFrom: input.timeFrom,
            timeTo: input.timeTo
          }
        }
      );
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

  async login(data: LoginDto): Promise<LoginResponseType> {
    try {
      console.log('🚀 Login request:', data);
      const response = await this.post<LoginResponseType>(
        'auth/email/login',
        data
      );
      console.log('✅ Login response:', response);
      return response.data;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  }

  async register(data: RegisterDto): Promise<void> {
    try {
      console.log('🚀 Register request:', data);
      const response = await this.post('auth/email/register', data);
      console.log('✅ Register response:', response);
    } catch (error: any) {
      console.error('❌ Register error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  }

  async confirmEmail(hash: string): Promise<void> {
    try {
      console.log('🚀 Confirm email request:', { hash });
      const response = await this.post('auth/email/confirm', { hash });
      console.log('✅ Confirm email response:', response);
    } catch (error) {
      console.error('❌ Confirm email error:', error);
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      console.log('🚀 Forgot password request:', { email });
      const response = await this.post('auth/forgot/password', { email });
      console.log('✅ Forgot password response:', response);
    } catch (error) {
      console.error('❌ Forgot password error:', error);
      throw error;
    }
  }

  async resetPassword(data: ResetPasswordDto): Promise<void> {
    try {
      console.log('🚀 Reset password request:', data);
      const response = await this.post('auth/reset/password', data);
      console.log('✅ Reset password response:', response);
    } catch (error) {
      console.error('❌ Reset password error:', error);
      throw error;
    }
  }

  async resetAuthUserPassword(data: AuthResetPasswordDto): Promise<void> {
    try {
      console.log('🚀 Reset auth user password request:', data);
      const response = await this.post('auth/reset/user/password', data);
      console.log('✅ Reset auth user password response:', response);
    } catch (error) {
      console.error('❌ Reset auth user password error:', error);
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
}

const defaultApiClient = new ApiClient();

//#endregion

// #region Player Behavior Dashboard API Functions
export async function getPlayerBehaviorDashboard(
  input: PlayerBehaviorInput
): Promise<DashboardStatisticsResponse> {
  return defaultApiClient.getPlayerBehaviorDashboard(input);
}
//#endregion

// #region Player Behavior Dashboard Hooks
export function useGetPlayerBehaviorDashboard(
  input: PlayerBehaviorInput
): UseQueryHookResult<DashboardStatisticsResponse> {
  return useQuery(() => defaultApiClient.getPlayerBehaviorDashboard(input));
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
  useDeleteAccount
};

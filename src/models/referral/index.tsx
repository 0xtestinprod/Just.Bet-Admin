import * as API from '@/api';

// Referral Statistics Types
export type ReferralStatisticsResponse = API.ReferralStatisticsResponse;
export type TopReferrer = API.TopReferrer;

// Rewards Analytics Types
export type RewardsAnalytics = API.RewardsAnalytics;
export type RewardBreakdown = API.RewardBreakdown;
export type RewardPercentageStats = API.RewardPercentageStats;
export type OverallRewards = API.OverallRewards;

// Claims Analytics Types
export type ClaimAnalytics = API.ClaimAnalytics;
export type ClaimOverall = API.ClaimOverall;
export type ClaimBreakdown = API.ClaimBreakdown;

// Export API functions and hooks
export { getReferralStatistics, useGetReferralStatistics } from '@/api';
export { getRewardsAnalytics, useGetRewardsAnalytics } from '@/api';
export { getClaimAnalytics, useGetClaimAnalytics } from '@/api';

export interface WalletAnalyticsData {
  transactionCount: number;
  paymentCount: number;
  totalVolume: number;
  walletAgeDays: number;
  recentActivity: number;
}

export interface ScoreBreakdown {
  walletAge: number;
  transactions: number;
  volume: number;
  activity: number;
  subscription: number;
}

export interface CreditScoreResult {
  score: number;
  breakdown: ScoreBreakdown;
}

export interface CreditLimitResult {
  creditLimit: number | null;
}

export interface AnalyzeWalletResponse {
  score: number;
  creditLimit: number | null;
  analytics: WalletAnalyticsData;
  breakdown: ScoreBreakdown;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface UserData {
  id: string;
  walletAddress: string;
  subscribed: boolean;
  subscriptionTxHash: string | null;
  creditScore: number | null;
  creditLimit: number | null;
  createdAt: string;
  updatedAt: string;
}

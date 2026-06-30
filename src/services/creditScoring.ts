import type {
  WalletAnalyticsData,
  CreditScoreResult,
  CreditLimitResult,
  ScoreBreakdown,
} from "@/types";

export function generateCreditScore(
  analytics: WalletAnalyticsData,
  isSubscribed: boolean
): CreditScoreResult {
  const breakdown: ScoreBreakdown = {
    walletAge: 0,
    transactions: 0,
    volume: 0,
    activity: 0,
    subscription: 0,
  };

  if (analytics.walletAgeDays > 180) {
    breakdown.walletAge = 30;
  } else if (analytics.walletAgeDays > 90) {
    breakdown.walletAge = 20;
  } else if (analytics.walletAgeDays > 30) {
    breakdown.walletAge = 10;
  }

  if (analytics.transactionCount > 100) {
    breakdown.transactions = 25;
  } else if (analytics.transactionCount > 50) {
    breakdown.transactions = 15;
  } else if (analytics.transactionCount > 10) {
    breakdown.transactions = 10;
  }

  if (analytics.totalVolume > 1000) {
    breakdown.volume = 25;
  } else if (analytics.totalVolume > 500) {
    breakdown.volume = 15;
  } else if (analytics.totalVolume > 100) {
    breakdown.volume = 10;
  }

  if (analytics.recentActivity > 0) {
    breakdown.activity = 20;
  }

  if (isSubscribed) {
    breakdown.subscription = 10;
  }

  const total =
    breakdown.walletAge +
    breakdown.transactions +
    breakdown.volume +
    breakdown.activity +
    breakdown.subscription;

  const score = Math.min(total, 100);

  return { score, breakdown };
}

export function assignCreditLimit(score: number): CreditLimitResult {
  if (score >= 80) {
    return { creditLimit: 100 };
  } else if (score >= 60) {
    return { creditLimit: 50 };
  } else if (score >= 40) {
    return { creditLimit: 20 };
  }
  return { creditLimit: null };
}

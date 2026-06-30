"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/providers/wallet-provider";
import { useUserData, useAnalyzeWallet } from "@/hooks/useWalletAnalytics";
import { useSubscription } from "@/hooks/useSubscription";
import { WalletCard } from "@/components/dashboard/wallet-card";
import { CreditScoreCard } from "@/components/dashboard/credit-score-card";
import { CreditLimitCard } from "@/components/dashboard/credit-limit-card";
import { AnalyticsCards } from "@/components/dashboard/analytics-cards";
import { ScoreBreakdownChart } from "@/components/dashboard/score-breakdown-chart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Activity, LogOut, Wallet, CheckCircle, AlertCircle } from "lucide-react";
import type { AnalyzeWalletResponse } from "@/types";

const SUBSCRIPTION_STATE_LABELS: Record<string, string> = {
  idle: "Pay 0.1 XLM with Freighter",
  opening: "Opening Freighter...",
  signing: "Waiting for approval...",
  submitting: "Processing payment...",
  success: "Subscription activated",
  error: "Try Again",
};

export default function DashboardPage() {
  const router = useRouter();
  const { address, isConnected, disconnect } = useWallet();
  const { data: userData, isLoading: userLoading, refetch: refetchUser } = useUserData(address);
  const analyzeWallet = useAnalyzeWallet();
  const { state, subscribe, isLoading } = useSubscription(address);

  const [result, setResult] = useState<AnalyzeWalletResponse | null>(null);

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  useEffect(() => {
    if (state === "success") {
      toast.success("Subscription activated!");
      refetchUser();
    }
  }, [state, refetchUser]);

  if (!address) return null;

  const handleAnalyze = async () => {
    try {
      const data = await analyzeWallet.mutateAsync(address);
      setResult(data);
      toast.success("Wallet analyzed successfully!");
      refetchUser();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis failed.");
    }
  };

  const handleSubscribe = async () => {
    try {
      await subscribe();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed.");
    }
  };

  const handleDisconnect = () => {
    disconnect();
    router.push("/");
  };

  const isSubscribed = userData?.subscribed ?? false;
  const hasResult = result || (userData?.creditScore != null);

  return (
    <main className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(120,80,255,0.08),_transparent_50%),radial-gradient(ellipse_at_bottom,_rgba(0,100,255,0.05),_transparent_50%)]" />

      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
              <span className="text-sm font-bold text-white">S</span>
            </div>
            <span className="text-lg font-semibold text-white">
              StellarCred
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDisconnect}
            >
              <LogOut className="mr-1 h-4 w-4" />
              Disconnect
            </Button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 pt-24 pb-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-white/60">
              Your decentralized credit profile
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isSubscribed && (
              <Button
                variant="outline"
                onClick={handleSubscribe}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {SUBSCRIPTION_STATE_LABELS[state]}
                  </>
                ) : state === "error" ? (
                  <>
                    <AlertCircle className="mr-2 h-4 w-4 text-red-400" />
                    {SUBSCRIPTION_STATE_LABELS[state]}
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    {SUBSCRIPTION_STATE_LABELS[state]}
                  </>
                )}
              </Button>
            )}
            <Button onClick={handleAnalyze} disabled={analyzeWallet.isPending}>
              {analyzeWallet.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Activity className="mr-2 h-4 w-4" />
                  Analyze Wallet
                </>
              )}
            </Button>
          </div>
        </div>

        {isSubscribed && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-sm font-medium text-green-400">
              Subscription Active
            </span>
          </div>
        )}

        {userLoading && !result && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        )}

        {hasResult && (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <WalletCard
                address={address}
                subscribed={isSubscribed}
              />
              <CreditScoreCard
                score={(result?.score ?? userData?.creditScore) ?? 0}
              />
              <CreditLimitCard
                creditLimit={(result?.creditLimit ?? userData?.creditLimit) ?? null}
              />
            </div>

            {result && (
              <>
                <AnalyticsCards
                  walletAgeDays={result.analytics.walletAgeDays}
                  transactionCount={result.analytics.transactionCount}
                  totalVolume={result.analytics.totalVolume}
                  recentActivity={result.analytics.recentActivity}
                />

                <ScoreBreakdownChart breakdown={result.breakdown} />
              </>
            )}
          </div>
        )}

        {!hasResult && !userLoading && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Activity className="mb-4 h-16 w-16 text-white/20" />
            <h2 className="text-xl font-semibold text-white/60">
              No Data Yet
            </h2>
            <p className="mt-2 text-sm text-white/40">
              Click "Analyze Wallet" to generate your credit score.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import type {
  AnalyzeWalletResponse,
  ApiResponse,
  UserData,
} from "@/types";

export function useUserData(walletAddress: string | null) {
  return useQuery({
    queryKey: ["user", walletAddress],
    queryFn: async () => {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
      });
      const data: ApiResponse<Record<string, unknown>> = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.data as unknown as UserData & { latestAnalytics: Record<string, unknown> | null };
    },
    enabled: !!walletAddress,
  });
}

export function useAnalyzeWallet() {
  return useMutation({
    mutationFn: async (walletAddress: string) => {
      const res = await fetch("/api/analyze-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
      });
      const data: ApiResponse<AnalyzeWalletResponse> = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.data!;
    },
  });
}

export function useVerifySubscription() {
  return useMutation({
    mutationFn: async ({
      walletAddress,
      transactionHash,
    }: {
      walletAddress: string;
      transactionHash: string;
    }) => {
      const res = await fetch("/api/verify-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress, transactionHash }),
      });
      const data: ApiResponse = await res.json();
      if (!data.success) throw new Error(data.message);
      return data;
    },
  });
}

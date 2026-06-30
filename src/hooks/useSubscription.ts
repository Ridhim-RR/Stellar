"use client";

import { useState, useCallback } from "react";
import { subscribeWithFreighter } from "@/services/subscriptionService";
import { useMutation } from "@tanstack/react-query";
import type { ApiResponse } from "@/types";

type SubscriptionState = "idle" | "opening" | "signing" | "submitting" | "success" | "error";

export function useSubscription(walletAddress: string | null) {
  const [state, setState] = useState<SubscriptionState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const verifyMutation = useMutation({
    mutationFn: async (transactionHash: string) => {
      const res = await fetch("/api/verify-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress,
          transactionHash,
        }),
      });
      const data: ApiResponse = await res.json();
      if (!data.success) throw new Error(data.message);
      return data;
    },
  });

  const subscribe = useCallback(async () => {
    if (!walletAddress) return;

    setState("opening");
    setErrorMessage(null);

    try {
      setState("signing");
      const txHash = await subscribeWithFreighter();

      setState("submitting");
      await verifyMutation.mutateAsync(txHash);

      setState("success");
      return txHash;
    } catch (err) {
      setState("error");
      const message =
        err instanceof Error ? err.message : "Subscription failed.";
      setErrorMessage(message);
      throw err;
    }
  }, [walletAddress, verifyMutation]);

  const reset = useCallback(() => {
    setState("idle");
    setErrorMessage(null);
  }, []);

  return {
    state,
    errorMessage,
    subscribe,
    reset,
    isPending: state !== "idle" && state !== "success" && state !== "error",
    isLoading: state === "opening" || state === "signing" || state === "submitting",
  };
}

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  isConnected,
  requestAccess,
  getAddress,
  getNetwork,
} from "@stellar/freighter-api";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
});

export function useWallet() {
  return useContext(WalletContext);
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    console.log("[WalletProvider] mount - typeof window:", typeof window);
    console.log("[WalletProvider] freighter-api isConnected fn:", typeof isConnected);

    const stored = localStorage.getItem("stellarcred_wallet");
    if (stored) {
      console.log("[WalletProvider] restoring wallet from localStorage:", stored);
      setAddress(stored);
    }
  }, []);

  const connect = useCallback(async () => {
    console.log("[WalletProvider] connect() called");

    if (typeof window === "undefined") {
      console.warn("[WalletProvider] window undefined, aborting");
      return;
    }

    try {
      setIsConnecting(true);

      console.log("[WalletProvider] checking isConnected...");
      const freighterConnected = await isConnected();
      console.log("[WalletProvider] isConnected result:", freighterConnected);

      if (!freighterConnected) {
        throw new Error(
          "Freighter wallet not detected. Please install Freighter."
        );
      }

      console.log("[WalletProvider] requesting access (permissions)...");
      const accessResult = await requestAccess();
      console.log("[WalletProvider] requestAccess result:", accessResult);

      if (!accessResult) {
        throw new Error(
          "Access denied. Please approve the connection request in Freighter."
        );
      }

      console.log("[WalletProvider] fetching address...");
      const addressResult = await getAddress();
      console.log("[WalletProvider] getAddress result:", addressResult);

      const publicKey = addressResult.address;
      if (!publicKey) {
        throw new Error(
          addressResult.error || "Could not fetch public key from Freighter."
        );
      }

      console.log("[WalletProvider] got public key:", publicKey);

      const networkResult = await getNetwork();
      console.log("[WalletProvider] Stellar network:", networkResult);

      setAddress(publicKey);
      localStorage.setItem("stellarcred_wallet", publicKey);

      console.log("[WalletProvider] persisting user to backend...");
      const resp = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: publicKey }),
      });
      const data = await resp.json();
      console.log("[WalletProvider] user API response:", data);
    } catch (err) {
      console.error("[WalletProvider] connect error:", err);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    console.log("[WalletProvider] disconnect");
    setAddress(null);
    localStorage.removeItem("stellarcred_wallet");
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        isConnecting,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
